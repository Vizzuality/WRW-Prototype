define([], function() {

  var legends = {
    'umd' : {
      title: 'Forest loss since 2000 (UMD/Google)',
      type: 'category',
      category: true,
      legend: [
        {
          name: 'Tree cover loss',
          color: '#BE688D'
        }
      ]
    },
    'forma' : {
      title: ' Deforestation alerts (Forma)',
      type: 'category',
      category: true,
      legend: [
        {
          name: 'Deforestation alerts',
          color: '#BE688D'
        }
      ]
    },
    'protected-areas' : {
      title: ' Protected areas',
      type: 'category',
      category: true,
      legend: [
        {
          name: 'Protected areas',
          color: '#38C10F'
        }
      ]
    },
    'agriculture' : {
      title: 'Global cropland extent',
      type: 'category',
      category: true,
      legend: [
        {
          name: 'Irrigated: Wheat and Rice Dominant',
          color: '#66FFCC'
        },
        {
          name: 'Irrigated: Mixed Crops 1: Wheat, Rice, Barley, Soybeans',
          color: '#416AC8'
        },
        {
          name: 'Irrigated: Mixed Crops 2: Corn, Wheat, Rice, Cotton, Orchards',
          color: '#FFE300'
        },
        {
          name: 'Rainfed: Wheat, Rice, Soybeans, Sugarcane, Corn, Cassava',
          color: '#CC7500'
        },
        {
          name: 'Rainfed: Wheat and Barley Dominant',
          color: '#CC0000'
        },
        {
          name: 'Rainfed: Corn and Soybeans Dominant',
          color: '#0000CC'
        },
        {
          name: 'Rainfed: Mixed Crops 1: Wheat, Corn, Rice, Barley, Soybeans',
          color: '#14D100'
        },
        {
          name: 'Minor Fractions of Mixed Crops: Wheat, Maize, Rice, Barley, Soybeans',
          color: '#085900'
        },
        {
          name: 'Other Classes',
          color: '#FFB8A8'
        }
      ]
    },
    'fires' : {
      title: 'Fires',
      type: 'choropleth',
      classname: 'fires',
      legend: ['#FEFB00', '#FF3C00'],
      min: 'less',
      max: 'more'
    },
    'grace' : {
      title: 'GRACE Groundwater trend',
      type: 'choropleth',
      classname: 'grace',
      legend: ['#FEFB00', '#FF3C00'],
      min: '-100%',
      max: '100'
    },
    'conflicts' : {
      title: 'Conflicts reported on mass media',
      type: 'choropleth',
      classname: 'conflicts',
      legend: ['#FEFB00', '#FF3C00'],
      min: 'less',
      max: 'more'
    },
    'protests' : {
      title: 'Protests reported on mass media',
      type: 'choropleth',
      classname: 'protests',
      legend: ['#FEFB00', '#FF3C00'],
      min: 'less',
      max: 'more'
    },
    'epidemic' : {
      title: 'Epidemics reported on mass media',
      type: 'choropleth',
      classname: 'epidemic',
      legend: ['#FEFB00', '#FF3C00'],
      min: 'less',
      max: 'more'
    },
    'population' : {
      title: 'Population density',
      type: 'choropleth',
      classname: 'population',
      legend: ['#fcc06d', '#c4a93b', '#998e20'],
      min: '0 people/km2',
      max: '1000 people/km2'
    },
    'temperature' : {
      title: 'Temperature',
      type: 'choropleth',
      classname: 'temperature',
      legend: ['#260058','#62009f','#ce0eb8','#e5381b','#f16a00','#ffc700', '#feeb3c'],
      min: '-40ºC',
      max: '40ºC'
    }
  };
  return legends;

});
