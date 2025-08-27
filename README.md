# Event Schedule

This project is aimed at pulling Devcon event schedule information and uploading it to a feed.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Resources](#resources)

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Solar-Punk-Ltd/event-schedule.git
cd event-schedule
```

2. **Install dependencies:**

```bash
npm install
```

3.  **Set up your environment variables:** Create a `.env` file in the root of the project with the variables listed in `.env.example` and assign them the required values.

4.  **Build the code:**

    ```bash
    npm run build
    ```

5.  **Start the server:**

    ```bash
    npm run start
    ```

## Configuration

The server requires the following environment variables to be set:

| Variable                | Description                                                                           |
| :---------------------- | :------------------------------------------------------------------------------------ |
| `BEE_API_URL`           | The URL of the Bee node used for uploading the event schedule.                        |
| `FEED_OWNER_ADDRESS`    | Feed owner's ethereum address in hex.                                                 |
| `FEED_TOPIC`            | The name of the feed's topic. keccak256 will be applied to it to create the manifest. |
| `STAMP`                 | The postage stamp ID used for uploading content to the feed.                          |
| `MAINNET_PK`            | The signer's private key used for updating the feed.                                  |
| `DEVCON_API_URL`        | The URL of the Devcon API.                                                            |
| `DEVCON_EVENT_ID`       | The ID of the Devcon event for which the schedule is uploaded.                        |
| `UPDATE_PERIOD_MINUTES` | The number of minutes between two consecutive event schedule polling.                 |

## Resources

- [What are Feeds? (Official Swarm Documentation)](https://docs.ethswarm.org/docs/develop/tools-and-features/feeds#what-are-feeds)
