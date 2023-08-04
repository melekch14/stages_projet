$(document).ready(function () {
  
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

  var table = $("#lotissementTable").DataTable({

    ajax: "/api/lotissemnts/getAll",
    columns: [
        { data: 'code_lotissement' },
        { data: 'nom' },
        { data: 'description' },
        {
            data: null,
            render: function (data, type, row) {
                return '<button type="button" class="btn btn-success btn-sm modify-button">Modifier</button>';
            }
        },
        {
            data: null,
            render: function (data, type, row) {
                return '<button type="button" class="btn btn-danger btn-sm delete-button">Supprimer</button>';
            }
        }
    ],
    "autoWidth": false,
    responsive: true,
    "order": [[1, 'asc']],
    buttons: [ 'copy', 'excel', 'pdf', 'print' ],
    dom: 'Bfrtip'

});


  $('#lotissementTable tbody').on('click', '.modify-button', function () {
    var dataTable = $(this).closest('table').DataTable();
    var data = dataTable.row($(this).closest('tr')).data();
    // Fill the input fields with the data from the clicked row
    $("#lotissement_nom").val(data.nom);
    $("#lotissement_code").val(data.code_lotissement);
    $("#lotissement_description").val(data.description);
    $("#code_lotissement").val(data.code_lotissement);
    $("#exampleModal").modal("show");
  });


  $('#lotissementTable tbody').on('click', '.delete-button', function () {
    var dataTable = $(this).closest('table').DataTable();
    var data = dataTable.row($(this).closest('tr')).data();
    var id = data.code_lotissement;

    $.ajax({
      url: "/api/lotissemnts/delete/" + id,
      method: "delete",
      success: function (response) {
        console.log(response);
        table.ajax.reload();
      },
      error: function (error) {
        console.log(error);
        // Handle login error
      }
    });
  });

  $("#clear").click(function () {
    $("#lotissement_nom").val("");
    $("#lotissement_code").val("");
    $("#lotissement_description").val("");
    $("#code_lotissement").val("0");
  });

  $("#save_lotissement").click(function () {

    var nom_lotissement = $("#lotissement_nom").val();
    var code_lotissement = $("#lotissement_code").val();
    var description_lotissement = $("#lotissement_description").val();

    var id_lots = $("#code_lotissement").val();
    var url = "";
    var method = "";
    if (id_lots == 0) {
      method = "POST";
      url = "/api/lotissemnts/create";
    } else {
      url = "/api/lotissemnts/update/" + id_lots;
      method = "PUT";
    }


    $.ajax({
      url: url,
      method: method,
      data: { code_lotissement: code_lotissement, nom: nom_lotissement, description: description_lotissement, location: "555sdqsd" },
      success: function (response) {
        console.log(response);
        $("#lotissement_nom").val("");
        $("#lotissement_code").val("");
        $("#lotissement_description").val("");
        $("#code_lotissement").val("0");
        table.ajax.reload();
        $("#exampleModal").modal("hide");
      },
      error: function (error) {
        console.log(error);
        // Handle login error
      }
    });

  });

});