require('dotenv').config()
const { 
    read,
    inquirerMenu,
    pause,
    ListOptions, 
} = require('./helpers/inquirer');
const Searches = require('./models/searches');

const main = async() => {
    let searches = new Searches();
    console.log(searches.readDb())
    do {
        console.clear();
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                console.clear();
                
                const termino = await read('Ciudad: ');
                //buscar lugar
                const places = await searches.search(termino);
                //seleccionar lugar
                const id = await ListOptions(places);
                if( id === 0 ) continue;

                const placeSel = places.find( p => p.id === id);
                searches.savePlace(placeSel.name);
                const weather = await searches.weatherPlace(placeSel.lat, placeSel.lng)
                console.log('\nInformacion del lugar:\n'.green)
                console.log(`Ciudad: `  + `${placeSel.name}`.cyan);
                console.log(`Tiempo: ` + `${ weather.description }`.green);
                console.log(`Latitud: `+`${placeSel.lat}`.cyan + ` Longitud: `+`${placeSel.lng}`.cyan);            
                console.log(`Temperatura: ` + `${ weather.temp }`.cyan  );
                console.log(`Temperatura mínima: ` + `${ weather.temp_min }`.blue );
                console.log(`Temperatura máxima: ` + `${ weather.temp_max }`.red  );
                break;
                
            case 2:
                searches.history.forEach(( p ) => {
                    console.log( p )
                })
                break;
            }        
        await pause();
    }while(opt !== 0);
}
main();