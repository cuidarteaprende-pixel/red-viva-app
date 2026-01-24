{ pkgs, ... }: {
  packages = [
    pkgs.nodejs_20
  ];

  preview = {
    command = "npm run dev";
    cwd = "red-viva-web";
    port = 3000;
  };
}
