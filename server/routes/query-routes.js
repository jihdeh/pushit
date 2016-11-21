import log from "../../util/log";
import pusher from "../config";
import Chance from "chance";
import axios from "axios";
let chance = new Chance();

function* authorizeChannel() {
  try {
    const socketId = this.query.socket_id;
    const channel = this.query.channel_name;
    const callback = this.query.callback;
    const name = chance.name();
    const presenceData = {
      user_id: name,
      user_info: {
        user_ip: this.params.ip,
        name
      }
    };
    const auth = JSON.stringify(pusher.authenticate(socketId, channel, presenceData));
    var cb = callback.replace(/\"/g, "") + "(" + auth + ");";
    this.set = {
      "Content-Type": "application/javascript"
    };
    this.body = cb;
  } catch (error) {
    console.log(error)
  }
}

export default { authorizeChannel };
