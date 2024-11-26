module.exports = {
  data: {
    name: "Play MP3",
  },
  category: "Music",
  UI: [
    {
      element: "input",
      name: "MP3 File Path",
      placeholder: "In Project Directory",
      storeAs: "path",
    },
    "-",
    {
      element: "dropdown",
      name: "Queuing",
      storeAs: "queuing",
      extraField: "queuePosition",
      choices: [
        { name: "Don't Queue, Just Play" },
        { name: "At End Of Queue" },
        { name: "At Start Of Queue" },
        {
          name: "At Custom Position",
          field: true,
          placeholder: "Queue Starts At #0",
        },
      ],
    },
  ],
  subtitle: (data, constants) => {
    return `File: ${data.path} - ${data.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const fs = require("fs");
    const ffmpeg = require("ffmpeg");

    const { createAudioResource } = require("@discordjs/voice");
    let path;
    if (fs.existsSync(`${require("../data.json").prjSrc}`)) {
      path = `${require("../data.json").prjSrc}/${bridge.transf(values.path)}`;
    } else {
      path = `./${bridge.transf(values.path)}`;
    }

    let audio = createAudioResource(path);

    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    switch (values.queuing) {
      case `Don't Queue, Just Play`:
        utilities.player.play(audio);
        utilities.nowPlaying = {
          file: bridge.transf(values.path),
          name: bridge.transf(values.path),
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        };
        client.emit('trackStart', bridge.guild, utilities.channel, utilities.nowPlaying);
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, {
          file: bridge.transf(values.path),
          name: bridge.transf(values.path),
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        });
        break;

      case `At Start Of Queue`:
        utilities.addToQueue(0, {
          file: bridge.transf(values.path),
          name: bridge.transf(values.path),
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        });
        break;

      case `At Custom Position`:
        utilities.addToQueue(Number(bridge.transf(values.queuePosition)), {
          file: bridge.transf(values.path),
          name: bridge.transf(values.path),
          author: "",
          url: "",
          src: "Local",
          audio: audio,
        });
        break;
    }
  },
};
