$(document).ready(function () {
  // Retrieve the token from local storage
  var token = localStorage.getItem('token');
  var username = localStorage.getItem('username');
  $("#currentUser").html(username);
  
  if (!token) {
    window.location.href = '/login.html';
  }

  

  $('#disconnectBtn').click(function () {
    $.ajax({
      url: '/api/auth/disconnect',
      method: 'POST',
      success: function (response) {
        console.log(response);
        localStorage.removeItem('token'); // Remove the token from local storage
        window.location.href = '/login.html';
      },
      error: function (error) {
        console.log(error);
      }
    });
  });

  $.ajax({
    url: '/api/rapport/getNbSoumByAppel',
    method: 'GET',
    success: function (response) {
      const dataSource = response;
      diplayAppelTotalsPie(dataSource);
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: '/api/lot/getLotNumber',
    method: 'GET',
    success: function (response) {
      $("#lotNb").html(response.nb);
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: '/api/appel-offre/getAppelNumber', 
    method: 'GET',
    success: function (response) {
      $("#appelNb").html(response.nb);
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: '/api/soumission/getNbSoumissions', 
    method: 'GET',
    success: function (response) {
      $("#soumissionNb").html(response.nb);
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: '/api/lotissemnts/getLotissementNumber',
    method: 'GET',
    success: function (response) {
      $("#lotissNb").html(response.nb);
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: '/api/participant/getParticipantNumber',
    method: 'GET',
    success: function (response) {
      $("#partNb").html(response.nb);
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: '/api/rapport/getChiffreSecteur',
    method: 'GET',
    success: function (response) {
      const dataSource = response;
      diplayVocationChiffre(dataSource);
    },
    error: function (error) {
      console.log(error);
    }
  });

  function diplayVocationChiffre(dataSource) {
    $(() => {
      $('#pies').dxPieChart({
        size: {
          width: 500,
        },
        palette: 'bright',
        dataSource,
        series: [
          {
            argumentField: 'vocation',
            valueField: 'total_chiffre_d_affaire',
            label: {
              visible: true,
              connector: {
                visible: true,
                width: 1,
              },
            },
          },
        ],
        title: "Chiffre d'affaire par vocation",
        export: {
          enabled: true,
        },
        onPointClick(e) {
          const point = e.target;

          toggleVisibility(point);
        },
        onLegendClick(e) {
          const arg = e.target;

          toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
        },
      });

      function toggleVisibility(item) {
        if (item.isVisible()) {
          item.hide();
        } else {
          item.show();
        }
      }
    });

  }

  function diplayAppelTotalsPie(dataSource) {
    $(() => {
      $('#pie').dxPieChart({
        size: {
          width: 500,
        },
        palette: 'bright',
        dataSource,
        series: [
          {
            argumentField: 'nom',
            valueField: 'total',
            label: {
              visible: true,
              connector: {
                visible: true,
                width: 1,
              },
            },
          },
        ],
        title: "Nombre de soumissions par appels d'offre",
        export: {
          enabled: true,
        },
        onPointClick(e) {
          const point = e.target;

          toggleVisibility(point);
        },
        onLegendClick(e) {
          const arg = e.target;

          toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
        },
      });

      function toggleVisibility(item) {
        if (item.isVisible()) {
          item.hide();
        } else {
          item.show();
        }
      }
    });

  }

  $.ajax({
    url: '/api/appelLot/getNbLotPerAppel',
    method: 'GET',
    success: function (response) {
      getNombreLotParAppel(response);
    },
    error: function (error) {
      console.log(error);
    }
  });

  function getNombreLotParAppel(dataSource){
    $(() => {
      $('#lotPerAppel').dxPieChart({
        type: 'doughnut',
        palette: 'Soft Pastel',
        title: "Nombre de lot par appels d'offre",
        dataSource,
        legend: {
          horizontalAlignment: 'center',
          verticalAlignment: 'bottom',
        },
        export: {
          enabled: true,
        },
        series: [{
          smallValuesGrouping: {
            mode: 'topN',
            topCount: 3,
          },
          argumentField: 'nom',
          valueField: 'nb',
          label: {
            visible: true,
            format: 'fixedPoint',
            customizeText(point) {
              return `${point.valueText}`;
            },
            connector: {
              visible: true,
              width: 1,
            },
          },
        }],
      });
    });
  }

  

});