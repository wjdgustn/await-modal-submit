const uniqueString = require('unique-string');

const waitingModal = {};

module.exports = client => {
    client.on('interactionCreate', interaction => {
        if(interaction.isModalSubmit() && waitingModal[interaction.customId]) {
            waitingModal[interaction.customId].resolve(interaction);
            delete waitingModal[interaction.customId];
        }

        interaction.awaitModalSubmit = async (modal, time) => {
            const customId = uniqueString();

            modal.setCustomId(customId);

            await interaction.showModal(modal);

            const promise = new Promise((resolve, reject) => {
                waitingModal[customId] = {
                    resolve,
                    reject
                }
            });

            if(time && waitingModal[customId]) setTimeout(() => {
                waitingModal[customId].reject(new Error('Modal timeout'));
                delete waitingModal[customId];
            }, time);

            return promise;
        }
    });
}