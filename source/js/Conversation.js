const Tile = require("./Tile.js");

function Conversation() {
    this.tile = new Tile({
        renderX: 0,
        renderY: 583,
        renderWidth: 1028,
        renderHeight: 179,
        tileWidth: 1028,
        tileHeight: 179,
        src: "img/conversation_background.png",
    });

    this.texts = [""];

    this.currentText = "";

    this.textsIndex = 0;

    // Hides the covnversation, do not render the converation if true
    this.hidden = false;
}

// Shows the next text
Conversation.prototype.next = function() {
    this.textsIndex += 1;
}

Conversation.prototype.addText = function(text) {
    this.texts.push(text);
}

Conversation.prototype.update = function(game) {
    let x = game.listeners.mousePositionX;
    let y = game.listeners.mousePositionY;

    // If clicked at conversation bar
    if (game.listeners.click === true && x > 0 && x < 1028 && y > 576 && y < 768) {
        // this.textsIndex += 1;

        // this.currentText = "";
    }

    if (this.currentText !== this.texts[this.textsIndex]) {
        console.log("HEJ!");
        if (game.tickCounter % 1 === 0) {
            this.currentText += this.texts[this.textsIndex][this.currentText.length];
        }
    }
}

Conversation.prototype.render = function(context) {
    // Do not render if conversation should be hidden
    if (this.hidden === true) {
        return;
    }

    this.tile.render(context);

    context.font = "45px Century Gothic";
    context.fillStyle = "rgba(0,0,0,0.7)";
    context.fillText(this.currentText, 75, 660);
}

module.exports = Conversation;
