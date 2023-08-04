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

    var table = $("#participantTable").DataTable({

        ajax: "/api/participant/getAll",
        columns: [
            { data: 'code_participant' },
            { data: 'nom' },
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

    
    $('#participantTable tbody').on('click', '.modify-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        // Fill the input fields with the data from the clicked row
        $("#code_participant").val(data.code_participant);
        $("#participant_nom").val(data.nom);
        $("#participant_code").val(data.code_participant);
        $("#partmod").modal("show");
    });

    $('#participantTable tbody').on('click', '.delete-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        var id = data.code_participant;

        $.ajax({
            url: "/api/participant/delete/" + id,
            method: "delete",
            success: function (response) {
                console.log(response);
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });

    $("#clear").click(function () {
        $("#code_participant").val("");
        $("#participant_nom").val("");
        $("#participant_code").val("0");
    });

    $("#save_participant").click(function () {
        var code_participant = $("#code_participant").val();
        var nom_participant = $("#participant_nom").val();
        var id_participant = $("#participant_code").val();
        var url = "";
        var method = "";

        if (id_participant == 0) {
            method = "POST";
            url = "/api/participant/create";
        } else {
            url = "/api/participant/update/" + id_participant;
            method = "PUT";
        }

        $.ajax({
            url: url,
            method: method,
            data: { code_participant: code_participant, nom: nom_participant },
            success: function (response) {
                console.log(response);
                $("#code_participant").val("");
                $("#participant_nom").val("");
                $("#participant_code").val("0");
                table.ajax.reload();
                $("#partmod").modal("hide");
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });
});
