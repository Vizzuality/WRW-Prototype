define([], function() {

  var legends = [
    umd : {
      title: 'Forest loss since 2000 (UMD/Google)',
      type: 'category',
      legend: [
        {
          name: 'Tree cover loss',
          color: '#BE688D'
        }
      ]
    },
    forma : {
      title: 'Forest loss since 2000 (UMD/Google)',
      type: 'category',
      legend: [
        {
          name: 'Tree cover loss',
          color: '#BE688D'
        }
      ]
    },
    forma : {
      title: 'Forest loss since 2000 (UMD/Google)',
      type: 'choropleth',
      legend: ['#BE688D', '#BE688D'],
      min: '18º',
      max: '56º'
    },
  ]
  return legends;

});
