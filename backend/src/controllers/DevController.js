const axios = require('axios')
const Dev = require('../models/Dev')
const ParseStringAsArray = require('../utils/parseStringAsArray');
// index, show, store, update, destroy

module.exports = {
    async index(request,response){
        const devs = await Dev.find();

        return response.json(devs)
    },

    async destroy(request, response) {
        const {github_username} = request.body;

        let dev = await Dev.findOne({github_username})

        if(dev){
            try {
                await Dev.deleteOne({github_username});
                return response.send("Deletado com Sucesso");
            } catch (error) {
                return response.send(`Erro ${error}`);
            }
        }
        else{
            return response.send("Usuário não encontrado");
        }
    },

    async update(request, response) {

        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({github_username});

        if (dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            let { name = login, avatar_url, bio = 'Sem Biografia' } = apiResponse.data;
         
            console.log(name,avatar_url,bio,github_username);
        
            techsArray = ParseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.updateOne({github_username},{
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        }
        return response.send('Atualizado');
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        
        let dev = await Dev.findOne({github_username})

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            let { name = login, avatar_url, bio = 'Sem Biografia' } = apiResponse.data;
         
            console.log(name,avatar_url,bio,github_username);
        
            techsArray = ParseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        }
    
        return response.json(dev);
    }
};