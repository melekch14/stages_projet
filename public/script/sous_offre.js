$(document).ready(function () {
  var token = localStorage.getItem('token');
    var username = localStorage.getItem('username');
    $("#currentUser").html(username);

    if (!token) {
        window.location.href = '/login.html';
    }
  // Retrieve the data from localStorage
  var dataReceived = localStorage.getItem("retraitData");
  var retraitid = "";
  var id_appof = "";
  if (dataReceived) {
    var data = JSON.parse(dataReceived);
    retraitid = data.retrait;
    id_appof = data.id_appel;
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

  $("#add_offre").click(function () {
    var title = $("#offre_title").val();
    var id_sf = $("#id_sf").val();
    var url = "";
    var method = "";
    if (id_sf == 0) {
      url = "/api/sous-offre/create/";
      method = "POST";
    } else {
      url = "/api/sous-offre/update/" + id_sf;
      method = "PUT";
    }
    $.ajax({
      url: url,
      method: method,
      data: { retrait: retraitid, titre: title },
      success: function (response) {
        displayAllOffre(retraitid);
        $("#offreMod").modal("hide");
        $("#id_sf").val("0");
        $("#offre_title").val("");
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });
  });

  $("#add_soum").click(function () {
    var principal = $("#Principale").val();
    principal = parseFloat(principal.replace(',', '.'));
    var option1 = $("#option1").val();
    var option2 = $("#option2").val();
    var id_sousoff = $("#id_sousoff").val();
    var lot = $('#lot_select').val();
    var id_soum = $("#id_soum").val();

    var url = "";
    var method = "";
    if (id_soum == "0") {
      url = "/api/soumission/create/";
      method = "POST"
    } else {
      url = "/api/soumission/update/" + id_soum;
      method = "PUT"
    }

    $.ajax({
      url: url,
      method: method,
      data: { option1: option1, option2: option2, principal: principal, id_s_offre: id_sousoff, lot: lot },
      success: function (response) {
        getAllSoumissionsByOffre(id_sousoff);
        $("#soumMod").modal("hide");
        $("#id_soum").val("0");
        $("#Principale").val("");
        $("#option1").val("");
        $("#option2").val("");
        
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });

  });

  $('#soumMod').on('show.bs.modal', function(event) {
    getLotByAppel(id_appof);
});

  //getLotByAppel(id_appof);

  function getLotByAppel(id_appel) {
    $.ajax({
      url: "/api/lot/getByAppel/" + id_appel,
      method: "GET",
      success: function (response) {
        $('#lot_select').html("");
        response = response.data
        if (response && response.length > 0) {
          var options = '';
          response.forEach(function (lot) {
            options += '<option value="' + lot.code_lot + '">' + lot.code_lot + '</option>';
          });
          $('#lot_select').html(options);
        }
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });
  }

  displayAllOffre(retraitid);

  function displayAllOffre(id) {
    $.ajax({
      url: "/api/sous-offre/getAllByRetrait/" + id,
      method: "GET",
      success: function (response) {
        console.log(response);
        populateTableBody(response);
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });
  }
  
  $('#soumMod').on('hidden.bs.modal', function () {
    $("#Principale").val("");
    $("#option1").val("");
    $("#option2").val("");
    $("#id_soum").val("0");
    $("#lot_select").html("");
    $("#lotissement_select").prop('selectedIndex', 0);
  });

  $('#offreMod').on('hidden.bs.modal', function () {
    $("#id_sf").val("0");
    $("#offre_title").val("");
  });

  function populateTableBody(data) {
    var tbody = $('#offreTable tbody');
    tbody.html("");
    data.forEach(function (item) {
      console.log(item);
      var row = '<tr> <td class="hidden">' + item.id_soff + '</td> <td>' + item.titre + '</td><td>' + item.participant + '</td><td>' + item.appel + '</td> <td> <a href="#" id="' + item.id_soff + '" class="btn btn-dim btn-sm btn-warning soumission-button">Soumissions</a> </td> <td> <button class="omodify-btn"> <i class="fas fa-pencil-alt"></i> Modifier </button> <button class="odelete-btn"> <i class="fas fa-trash"></i> Supprimer </button> </td></tr>';
      tbody.append(row);
    });
  }

  $('#offreTable tbody').on('click', '.omodify-btn', function () {
    const row = $(this).closest('tr');
    const id_sous = row.find('td:eq(0)').text();
    const nomOffre = row.find('td:eq(1)').text();
    $("#offre_title").val(nomOffre);
    $("#id_sf").val(id_sous);
    $("#offreMod").modal("show");
  });

  $('#offreTable tbody').on('click', '.odelete-btn', function () {
    const row = $(this).closest('tr');
    const id_sous = row.find('td:eq(0)').text();

    $.ajax({
      url: "/api/sous-offre/delete/" + id_sous,
      method: "delete",
      success: function (response) {
        displayAllOffre(retraitid);
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });

  });

  $("#offreTable tbody").on('click', '.soumission-button', function () {
    var id = $(this).attr('id');
    $("#id_sousoff").val(id);
    $("#all_soumissions").removeClass("d-sm-none");
    getAllSoumissionsByOffre(id);
  });

  function getAllSoumissionsByOffre(offre) {
    $.ajax({
      url: "/api/soumission/getAllByOffre/" + offre,
      method: "GET",
      success: function (response) {
        console.log(response);
        populateTableSoumission(response);
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });
  }



  function populateTableSoumission(data) {
    var tbody = $('#soumTable tbody');
    tbody.html("");

    data.forEach(function (item) {
      console.log(item);
      var row = '<tr> <td class="hidden">' + item.id_soum + '</td> <td class="hidden">' + item.id_s_offre + '</td> <td>' + item.code_lot + '</td><td>' + item.principal.toFixed(3) + '</td><td>' + item.option1.toFixed(3) + '</td> <td>' + item.option2.toFixed(3) + '</td> <td> <button class="modify-btn"> <i class="fas fa-pencil-alt"></i> Modifier </button> <button class="delete-btn"> <i class="fas fa-trash"></i> Supprimer </button> </td> </tr>';
      tbody.append(row);
    });
  }

  function getLotByLotissementWithSelected(idLotissement, lotp) {
    $.ajax({
      url: "/api/lot/getByLotissement/" + idLotissement,
      method: "GET",
      success: function (response) {
        $('#lot_select').html("");
        response = response.data
        if (response && response.length > 0) {
          var options = '';
          response.forEach(function (lot) {
            if (lot.code_lot == lotp) {
              options += '<option selected value="' + lot.code_lot + '">' + lot.code_lot + '</option>';
            } else {
              options += '<option value="' + lot.code_lot + '">' + lot.code_lot + '</option>';
            }

          });
          $('#lot_select').html(options);
        }
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });
  }

  $('#soumTable tbody').on('click', '.modify-btn', function () {
    const row = $(this).closest('tr');
    const id_soum = row.find('td:eq(0)').text();
    const lot = row.find('td:eq(2)').text();
    const principale = row.find('td:eq(3)').text();
    const op1 = row.find('td:eq(4)').text();
    const op2 = row.find('td:eq(5)').text();

    $.ajax({
      url: "/api/lot/getById/" + lot,
      method: "GET",
      success: function (response) {
        let lotiisement = response.lotissement;
        $('#lotissement_select').val(lotiisement);
        getLotByLotissementWithSelected(lotiisement, lot);

        $("#Principale").val(principale);
        $("#option1").val(op1);
        $("#option2").val(op2);
        $("#id_soum").val(id_soum);
        $("#soumMod").modal("show");
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });

  });

  $('#soumTable tbody').on('click', '.delete-btn', function () {
    const row = $(this).closest('tr');
    const id_soum = row.find('td:eq(0)').text();
    const id_sous = row.find('td:eq(1)').text();

    $.ajax({
      url: "/api/soumission/delete/" + id_soum,
      method: "delete",
      success: function (response) {
        getAllSoumissionsByOffre(id_sous);
      },
      error: function (error) {
        console.log(error);
        // Handle error
      }
    });

  });

});