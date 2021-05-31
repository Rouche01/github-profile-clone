const fetchUserProfile = async (username) => {
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
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

export { fetchUserProfile };
