const { Client, GatewayIntentBits } = require("discord.js");
const {
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  // Check if a member joined a voice channel
  if (!oldState.channelId && newState.channelId) {
    const channel = newState.channel;

    // Connect to the voice channel
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
      // Wait for the connection to become ready
      console.log("Girdi");
      const resource = createAudioResource(
        fs.createReadStream("welcomeSFX.mp3")
      );
      const player = createAudioPlayer();
      player.play(resource);

      connection.subscribe(player);

      // Wait for the sound to finish playing
      await new Promise((resolve) => {
        player.once("idle", () => {
          connection.destroy();
          resolve();
        });
      });
    } catch (error) {
      console.error(`Error playing sound: ${error}`);
      connection.destroy();
    }
  }
});

client.login(DISCORD_TOKEN);
