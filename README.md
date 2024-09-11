# 2077 Bounties

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Testing

To run all tests:

```bash
npm run test
```

To run integration tests

```bash
npm run test:integration
```

To run e2e tests

```bash
npm run test:e2e
```

Integration and e2e tests uses docker databases. To run the tests you need to have docker and installed.

Steps to run docker-compose without sudo:
Add your user to the docker group: Run the following command to add your user to the docker group:

```bash
sudo usermod -aG docker $USER
```

The `-aG` flag appends your user to the docker group without removing them from any other groups.
`$USER` is an environment variable that automatically represents your current username.
Restart your session: After adding your user to the docker group, you need to log out and log back in for the changes to take effect. Alternatively, you can restart your shell by running:

```bash
newgrp docker
```

Verify if it works: After re-logging or restarting your session, check whether you can run docker and docker-compose commands without sudo by running:

```bash
docker ps
```

If the command works without requiring sudo, you're all set.
