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

    var table = $("#retraitTable").DataTable({

        ajax: "/api/offre-de-soumission/getAll",
        columns: [
            { data: 'nom' },
            { data: 'offre' },
            {
                data: 'date',
                render: function (data, type, row) {
                    // Format the date using a library like Moment.js
                    var formattedDate = moment(data).format("DD/MM/YYYY");
                    return formattedDate;
                }
            },
            { "data": "description" },
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
            },
            {
                data: "id_retrait",
                render: function (data, type, row) {
                    return '<button type="button" id=' + data + ' class="btn btn-info btn-sm offre-button">Offre</button>';
                }
            }
        ],
        "autoWidth": false,
        responsive: true,
        "order": [[1, 'asc']],
        buttons: [ 'copy', 'excel', 'pdf', 'print' ],
        dom: 'Bfrtip'

    });

    $.ajax({
        url: "/api/participant/getAll",
        method: "GET",
        success: function (response) {
            response = response.data
            if (response && response.length > 0) {
                var options = '';
                response.forEach(function (participant) {
                    var displayedText = participant.code_participant + " - " + participant.nom;
                    options += '<option value="' + participant.code_participant + '">' + displayedText + '</option>';
                });
                $('#participant_select').html(options);
            }
        },
        error: function (error) {
            console.log(error);
            // Handle error
        }
    });

    $.ajax({
        url: "/api/appel-offre/getAll",
        method: "GET",
        success: function (response) {
            response = response.data
            if (response && response.length > 0) {
                var options = '';
                response.forEach(function (appel) {
                    options += '<option value="' + appel.id_appel + '">' + appel.nom + '</option>';
                });
                $('#appel_select').html(options);
            }
        },
        error: function (error) {
            console.log(error);
            // Handle error
        }
    });

    $('#retraitTable tbody').on('click', '.modify-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        $("#exampleModal").modal('show');
        $("#id_retrait").val(data.id_retrait);
        $("#appel_select").val(data.id_appof);
        $("#participant_select").val(data.participant);
        var date = moment(data.date).format("YYYY-MM-DD");
        $("#date_cr").val(date);
        $("#retrait_description").val(data.description);
    });

    $('#retraitTable tbody').on('click', '.delete-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        var id = data.id_retrait;

        $.ajax({
            url: "/api/offre-de-soumission/delete/" + id,
            method: "DELETE",
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

    $('#retraitTable tbody').on('click', '.offre-button', function () {
        var id = $(this).attr('id');
        $.ajax({
            url: "/api/offre-de-soumission/getById/" + id,
            method: "GET",
            success: function (response) {
                var dataToSend = { retrait: id , id_appel:response.id_appof};
                localStorage.setItem("retraitData", JSON.stringify(dataToSend));
                window.location.href = "sous_offres.html";
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });

    $("#clear").click(function () {
        $("#id_retrait").val("0");
        $("#appel_select").val("");
        $("#participant_select").val("");
        $("#date_cr").val("");
        $("#retrait_description").val("");
    });


    $("#save_retrait").click(function () {
        var appel = $("#appel_select").val();
        var participant = $("#participant_select").val();
        var datecr = $("#date_cr").val();
        var description = $("#retrait_description").val();
        var id_retrait = $("#id_retrait").val();
        var url = "";
        var method = "";

        if (id_retrait == 0) {
            method = "POST";
            url = "/api/offre-de-soumission/create";
        } else {
            url = "/api/offre-de-soumission/update/" + id_retrait;
            method = "PUT";
        }

        $.ajax({
            url: url,
            method: method,
            data: { description: description, date: datecr, participant: participant, id_appof: appel },
            success: function (response) {
                console.log(response);
                $("#id_retrait").val("0");
                $("#appel_select").val("");
                $("#participant_select").val("");
                $("#date_cr").val("");
                $("#retrait_description").val("");
                $("#exampleModal").modal('hide');
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });

});