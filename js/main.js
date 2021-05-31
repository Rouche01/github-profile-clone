const fetchUserProfile = async (username) => {
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${env.api_key}`,
      },
      body: JSON.stringify({
        query: `
              query MyQuery($username: String!) {
                user(login: $username) {
                  avatarUrl
                  email
                  repositories(last: 20) {
                    nodes {
                      description
                      name
                      forks {
                        totalCount
                      }
                      stargazerCount
                      updatedAt
                      primaryLanguage {
                        color
                        name
                      }
                    }
                  }
                  company
                  bio
                  followers {
                    totalCount
                  }
                  following {
                    totalCount
                  }
                  location
                  login
                  name
                  starredRepositories {
                    totalCount
                  }
                  twitterUsername
                  websiteUrl
                  organizations(first: 5) {
                    nodes {
                      avatarUrl(size: 40)
                      name
                    }
                  }
                }
              }
            `,
        variables: {
          username,
        },
      }),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

let user;

const loginInput = document.getElementById("username-input");
const retrieveBtn = document.getElementById("retrieve-btn");
const errorText = document.getElementById("error-text");
const profileImg = document.getElementById("profile-img");
const burgerMenu = document.getElementById("mobileMenuBtn");
const profileBody = document.getElementById("profile-body");
const userFullName = document.getElementById("user-fullname");
const userLogin = document.getElementById("user-login");
const stickyLogin = document.getElementById("sticky-login");
const userBio = document.getElementById("user-bio");
const mainProfilePic = document.getElementById("main-profile-pic");
const followers = document.getElementById("followers");
const followings = document.getElementById("followings");
const stars = document.getElementById("stars");
const userCompany = document.getElementById("user-company");
const companyName = document.getElementById("company-name");
const userLocation = document.getElementById("location");
const locationName = document.getElementById("location-name");
const userEmail = document.getElementById("email-github");
const emailValue = document.getElementById("email-value");
const userWebsite = document.getElementById("website");
const websiteLink = document.getElementById("website-link");
const userTwitter = document.getElementById("twitter");
const twitterHandle = document.getElementById("twitter-handle");
const orgsList = document.getElementById("orgs-list");
const repoList = document.getElementById("repo-list");
const stickyProfilePicture = document.getElementById("sticky-profile-picture");
const mobileProfilePicture = document.getElementById("mobile-profile-picture");
const headerProfilePicture = document.getElementById("header-profile-picture");
const repoCount = document.getElementById("repo-number-badge");

const savedUserData = localStorage.getItem("userData");
const parsedUserData = JSON.parse(savedUserData);

console.log(parsedUserData);

const displayStickyProfileCallback = (entries) => {
  entries.forEach((entry) => {
    const elementToToggle = document.getElementById("sticky-image");
    elementToToggle.style.display = entry.isIntersecting ? "none" : "flex";
  });
};
const observer = new IntersectionObserver(displayStickyProfileCallback);

const getUserData = async (userInput) => {
  retrieveBtn.innerText = "Retrieving...";
  retrieveBtn.disabled = true;
  const result = await fetchUserProfile(loginInput.value);
  user = result.data.user;
  retrieveBtn.innerText = "Retrieve User";
  retrieveBtn.disabled = false;
};

const navigateToProfile = async (inputValue) => {
  if (!inputValue) {
    errorText.style.display = "block";
  } else {
    errorText.style.display = "none";
    await getUserData(inputValue);
    localStorage.setItem("userData", JSON.stringify(user));
    if (user) {
      window.location.href = "./profile.html";
    } else {
      errorText.style.display = "block";
      errorText.innerText = "This user does not exist";
    }
  }
};

const retrieveUserData = async () => {
  retrieveBtn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await navigateToProfile(loginInput.value);
  });
};

const modifyNumberStat = (number) => {
  if (number < 1000) {
    return number;
  } else {
    const roundedNumber = Math.round(number / 100) * 100;
    return `${(roundedNumber / 1000).toFixed(1)}k`;
  }
};

const handleSubmitWithKeyPress = async () => {
  loginInput.addEventListener("keypress", async (ev) => {
    if (ev.key.toLowerCase() === "enter" || ev.code.toLowerCase() === "enter") {
      await navigateToProfile(loginInput.value);
    }
  });
};

const calcDayDifference = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const oneDay = 1000 * 60 * 60 * 24;
  const startDate = new Date(date);
  const now = new Date();

  const daysDiff = (now.getTime() - startDate.getTime()) / oneDay;

  if (daysDiff > 30) {
    return ` Updated on ${startDate.getDate()} ${months[startDate.getMonth()]}`;
  } else if (daysDiff < 1 && daysDiff > 0) {
    const numberOfSeconds = daysDiff * 24 * 60 * 60;
    const numberOfHours = daysDiff * 24;
    const numberOfMins = daysDiff * 24 * 60;
    if (numberOfSeconds < 30) {
      return "Updated just now";
    } else if (numberOfSeconds > 1800) {
      return `Updated ${numberOfHours.toFixed()} ${
        numberOfHours > 1 ? `hours` : `hour`
      } ago`;
    } else {
      console.log(
        `Updated ${numberOfMins.toFixed()} ${
          numberOfHours > 1 ? `minutes` : `minute`
        } ago`
      );
    }
  } else {
    return `Updated ${daysDiff.toFixed(0)} days ago`;
  }
};

profileImg ? observer.observe(profileImg) : null;
loginInput && handleSubmitWithKeyPress();
retrieveBtn && retrieveUserData();
burgerMenu &&
  burgerMenu.addEventListener("click", () => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu.style.display === "block") {
      mobileMenu.style.display = "none";
    } else {
      mobileMenu.style.display = "block";
    }
  });

if (profileBody) {
  userFullName.innerText = parsedUserData.name;
  userLogin.innerText = parsedUserData.login;
  userBio.innerText = parsedUserData.bio;
  stickyLogin.innerText = parsedUserData.login;
  followers.innerText = modifyNumberStat(
    Number(parsedUserData.followers.totalCount)
  );
  followings.innerText = modifyNumberStat(
    Number(parsedUserData.following.totalCount)
  );
  stars.innerText = modifyNumberStat(
    Number(parsedUserData.starredRepositories.totalCount)
  );
  mainProfilePic.src = parsedUserData.avatarUrl;
  stickyProfilePicture.src = parsedUserData.avatarUrl;
  headerProfilePicture.src = parsedUserData.avatarUrl;
  mobileProfilePicture.src = parsedUserData.avatarUrl;
  repoCount.innerHTML = parsedUserData.repositories.nodes.length;
  parsedUserData.company
    ? (companyName.innerText = parsedUserData.company)
    : (userCompany.style.display = "none");
  parsedUserData.location
    ? (locationName.innerText = parsedUserData.location)
    : (userLocation.style.display = "none");
  parsedUserData.email
    ? (emailValue.innerText = parsedUserData.email)
    : (userEmail.style.display = "none");
  parsedUserData.websiteUrl
    ? (websiteLink.innerText = parsedUserData.websiteUrl)
    : (userWebsite.style.display = "none");
  parsedUserData.twitterUsername
    ? (twitterHandle.innerText = `@${parsedUserData.twitterUsername}`)
    : (userTwitter.style.display = "none");

  parsedUserData.organizations.nodes.forEach((curr, idx) => {
    const markup = `<li><a href="#"><img src="${curr.avatarUrl}" alt="${curr.name}"></a></li>`;
    orgsList.insertAdjacentHTML("beforeend", markup);
  });

  parsedUserData.repositories.nodes.forEach((curr, idx) => {
    const markup = `<div class="repository-instance">
      <div class="left-col">
        <h3 class="repository-name"><a href="#">${curr.name}</a></h3>
        ${
          curr.description
            ? `<p class="repo-description">${curr.description}</p>`
            : ""
        }
        <div class="repo-stats">
          ${
            curr.primaryLanguage
              ? `<div class="major-language">
            <span style="background-color: ${curr.primaryLanguage.color};" class="legend"></span>
            <span class="lang">${curr.primaryLanguage.name}</span>
          </div>`
              : ""
          }
          ${
            curr.stargazerCount > 0
              ? `<div class="star-gazes">
            <a href="#">
              <svg aria-label="star" class="repo-stat-icons" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
            <span class="count">${curr.stargazerCount}</span>
            </a>
          </div>`
              : ""
          }
          ${
            curr.forks.totalCount > 0
              ? `<div class="forks">
            <a href="#">
              <svg aria-label="fork" class="repo-stat-icons" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
              <span class="count">${curr.forks.totalCount}</span>
            </a>
          </div>`
              : ""
          }
          <div class="last-update">
            <span>${calcDayDifference(curr.updatedAt)}</span>
          </div>
        </div>
      </div>
      <div class="right-col">
        <button>
          <svg class="star-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
          Star
        </button>
      </div>
    </div>`;

    repoList.insertAdjacentHTML("beforeend", markup);
  });
}

calcDayDifference("2021-05-31T07:16:57Z");
