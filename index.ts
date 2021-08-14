interface Meta {
  page: number;
  resultsPerPage: number;
  time: number;
  totalCount: number;
  totalPages: number;
}

interface Item {
  name: string;
  owner: {
    login: string;
  };
  html_url: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  ssh_url: string;
}

interface Response {
  total_count: number;
  incomplete_results: boolean;
  items: Item[];
}

try {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${Deno.args[0]}&sort=stars&order=desc`
  );
  const body: Response = await res.json();

  const packages = {
    items: body.items.map((item) => {
      return {
        title: `${item.name}`,
        subtitle: `${item.description} (${item.owner.login} | ${item.stargazers_count} stars)`,
        arg: item.html_url,
        mods: {
          alt: {
            valid: true,
            arg: `https://github.com/${item.owner.login}/${item.name}/issues`,
            subtitle: `Open Issues ${item.open_issues_count}`,
          },
          cmd: {
            valid: true,
            arg: `https://github.com/${item.owner.login}/${item.name}/pulls`,
            subtitle: "Open Pull requests",
          },
        },
        text: {
          copy: item.ssh_url,
          largetype: item.ssh_url,
        },
      };
    }),
  };

  console.log(JSON.stringify(packages));
} catch (error) {
  console.log(
    JSON.stringify({
      items: [
        {
          title: error.name,
          subtitle: error.message,
          valid: false,
          text: {
            copy: error.stack,
          },
        },
      ],
    })
  );
}
