const { ChannelTypes, Permissions, Client, TextableChannel, OverwriteTypes } = require("oceanic.js");

module.exports = {
  category: "Channels",
  data: {
    name: "Create Voice Channel",
  },
  UI: [
    {
      element: "input",
      name: "Name",
      storeAs: "channelName",
    },
    "-",
    {
      element: "toggle",
      name: "Visibility",
      true: "Private",
      false: "Public",
      storeAs: "private"
    },
    "-",
    {
      element: "category",
      storeAs: "category",
      optional: true
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "position",
      choices: {
        unset: {name: "Default"},
        set: {name: "Custom"},
      },
      name: "Positon"
    },
    "-",
    {
      element: "largeInput",
      storeAs: "topic",
      name: "Channel Topic"
    },
    "-",
    {
      element: "input",
      storeAs: "reason",
      name: "Reason",
      placeholder: "Optional"
    },
    "-",
    {
      element: "storage",
      name: "Store Channel As",
      storeAs: "store"
    }
  ],

  subtitle: "Name: $[name]$",
  compatibility: ["Any"],

  
  /**
   * @param {Client} client
   * @returns {*}
   */
  async run(values, message, client, bridge) {
    /**
     * @type {TextableChannel}
     */
    let channelOptions = {
      name: bridge.transf(values.channelName),
      reason: values.reason ? bridge.transf(values.reason) : undefined,
      nsfw: false,
      topic: values.topic ? bridge.transf(values.topic) : undefined
    }

    if (values.position?.type == 'set') {
      channelOptions.position = bridge.transf(values.position.type)
    }
    if (values.category) {
      channelOptions.parentID = (await bridge.getChannel(values.category)).id;
    }
    if (values.private == true) {
      let roleID =  bridge.guild.roles.find(r => r.position == 0).id;

      channelOptions.permissionOverwrites = [{
        deny: Permissions.VIEW_CHANNEL,
        type: OverwriteTypes.ROLE,
        id: roleID
      }];
    }

    let channel = await bridge.guild.createChannel(ChannelTypes.GUILD_VOICE, channelOptions);
    
    bridge.store(values.store, channel)
  },
};
