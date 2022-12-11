const fs = require('fs')
const axios = require('axios')

//Delt@hikkos12
class Searches{
    history = [];
    dbPath = './db/database.json';
    constructor(){
        this.history = this.readDb();
    }
    get paramsMapBox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language': 'es',
            'proximity':'ip'
        }
    }
    async search( location = 'ola'){
        try {
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ location }.json`,
                //params vienen despues del '?'
                params:this.paramsMapBox
            });
            const resp = await instance.get();            
           
            //Retornar las coincidencias
            return resp.data.features.map(location =>({
                id: location.id,
                name: location.place_name,
                lng: location.center[0],
                lat: location.center[1],
            }));
        } catch (error) {
            return []
        }
    }
    async weatherPlace(lat,lon){
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params:{
                    lat,
                    lon,
                    'appid': process.env.OPEN_WEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                }
            })
            const resp = await instance.get();
            const { weather } = resp.data;
            const { description } = weather[0];
            const { main } = resp.data;
            const {temp, temp_min, temp_max} = main;
            return ({
                description,
                temp_min,
                temp_max,
                temp
            })
            /* console.log(temp)
            console.log(temp_min)
            console.log(temp_max) */
        } catch (error) {
            console.log(error)          
        }

    }
    savePlace(place = ''){
        if( this.history.includes( place.toLocaleLowerCase() ) ){
            return
        }
        this.history.unshift( place.toLowerCase() );
        this.saveDB();
    }
    saveDB(){
        const payload = {    
            history : this.history
        }
        fs.writeFileSync(this.dbPath,JSON.stringify( payload ));
    }
    readDb(){
        if( !fs.existsSync(this.dbPath) )
            return [];
        const info = JSON.parse( fs.readFileSync( this.dbPath, { encoding: 'utf-8' } ) );
        return info.history;
    }
}
module.exports = Searches;