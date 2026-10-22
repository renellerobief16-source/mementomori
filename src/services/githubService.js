// GitHub REST API Integration Service
const GITHUB_USERNAME = "renellerobief16-source";
const CACHE_KEY_USER = `gh_user_${GITHUB_USERNAME}`;
const CACHE_KEY_REPOS = `gh_repos_${GITHUB_USERNAME}`;
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchGitHubProfile() {
  try {
    // Check cached data first
    const cached = localStorage.getItem(CACHE_KEY_USER);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) {
        return parsed.data;
      }
    }

    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem(
      CACHE_KEY_USER,
      JSON.stringify({ timestamp: Date.now(), data })
    );
    return data;
  } catch (error) {
    console.warn("Could not fetch live GitHub profile, using fallback:", error);
    return {
      login: GITHUB_USERNAME,
      name: "Renelle Robie D. Lopez",
      avatar_url: "https://avatars.githubusercontent.com/u/237668816?v=4",
      bio: "Full-Stack Web Developer & UI Engineer",
      public_repos: 23,
      followers: 12,
      following: 8,
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      location: "Philippines",
    };
  }
}

export async function fetchGitHubRepos() {
  try {
    // Check cached repos
    const cached = localStorage.getItem(CACHE_KEY_REPOS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) {
        return parsed.data;
      }
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=8`
    );
    if (!response.ok) {
      throw new Error(`GitHub Repos API error: ${response.status}`);
    }

    const data = await response.json();
    // Filter and map relevant repo fields
    const formatted = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "Web application repository with responsive components and modern design.",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || "JavaScript",
      updatedAt: new Date(repo.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      htmlUrl: repo.html_url,
      homepage: repo.homepage || null,
      topics: repo.topics || [],
    }));

    localStorage.setItem(
      CACHE_KEY_REPOS,
      JSON.stringify({ timestamp: Date.now(), data: formatted })
    );
    return formatted;
  } catch (error) {
    console.warn("Could not fetch live GitHub repos, using fallback:", error);
    return [
      {
        id: 1,
        name: "Libralink",
        description: "Modern digital library & catalog management platform with search and book lending features.",
        stars: 4,
        forks: 1,
        language: "JavaScript",
        updatedAt: "Recent",
        htmlUrl: `https://github.com/${GITHUB_USERNAME}/Libralink`,
        homepage: "https://libralinkkk.vercel.app",
        topics: ["react", "library-system", "web-app"],
      },
      {
        id: 2,
        name: "dayrit-clinic",
        description: "Healthcare appointment & medical consultation portal designed for clinic workflows.",
        stars: 3,
        forks: 0,
        language: "JavaScript",
        updatedAt: "Recent",
        htmlUrl: `https://github.com/${GITHUB_USERNAME}/dayrit-clinic`,
        homepage: "https://dayrit-clinic.vercel.app",
        topics: ["healthcare", "clinic-system", "responsive"],
      },
      {
        id: 3,
        name: "clinic",
        description: "Patient management and consultation booking interface.",
        stars: 2,
        forks: 0,
        language: "HTML",
        updatedAt: "Recent",
        htmlUrl: `https://github.com/${GITHUB_USERNAME}/clinic`,
        homepage: null,
        topics: ["clinic", "booking"],
      },
      {
        id: 4,
        name: "partyneeds",
        description: "Event logistics and party supply reservation hub.",
        stars: 1,
        forks: 0,
        language: "JavaScript",
        updatedAt: "Recent",
        htmlUrl: `https://github.com/${GITHUB_USERNAME}/partyneeds`,
        homepage: null,
        topics: ["party", "events"],
      },
    ];
  }
}
