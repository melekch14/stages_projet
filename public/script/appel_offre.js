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


    var table = $("#appelOffTable").DataTable({

        ajax: "/api/appel-offre/getAll",
        columns: [
            { data: 'nom' },
            { data: 'num_appel' },
            {
                data: 'date_creation',
                render: function (data, type, row) {
                    // Format the date using a library like Moment.js
                    var formattedDate = moment(data).format("DD/MM/YYYY");
                    return formattedDate;
                }
            },
            {
                data: 'date_limite',
                render: function (data, type, row) {
                    // Format the date using a library like Moment.js
                    var formattedDate = moment(data).format("DD/MM/YYYY");
                    return formattedDate;
                }
            },
            { data: 'username' },
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
                data: "id_appel",
                render: function (data, type, row) {
                    return '<button type="button" id=' + data + ' class="btn btn-info btn-sm detail-button">Detail</button>';
                }
            }
        ],
        "autoWidth": false,
        responsive: true,
        "order": [[1, 'asc']],
        buttons: ['copy', 'excel', 'pdf', 'print'],
        dom: 'Bfrtip'

    });


    $('#appelOffTable tbody').on('click', '.modify-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        // Fill the input fields with the data from the clicked row
        $("#exampleModal").modal('show');
        $("#id_appel_offre").val(data.id_appel);
        $("#nom_af").val(data.nom);
        $("#num_af").val(data.num_appel);
        var date_creation = moment(data.date_creation).format("YYYY-MM-DD");
        var date_limite = moment(data.date_limite).format("YYYY-MM-DD");
        $("#date_af").val(date_creation);
        $("#date_lim_af").val(date_limite);
    });

    $.ajax({
        url: "/api/lot/getAll",
        method: "GET",
        success: function (response) {
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



    function reloadTable(id) {
        $.ajax({
            url: "/api/appelLot/getByAppel/" + id,
            method: "GET",
            success: function (response) {
                var tbody = $("#myTable2 tbody");
                tbody.empty();
                $.each(response.data, function (index, aol) {
                    var row = "<tr>" +
                        "<td>" + aol.offre + "</td>" +
                        "<td>" + aol.lot + "</td>" +
                        "</tr>";
                    tbody.append(row);
                });
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    }

    $('#appelOffTable tbody').on('click', '.detail-button', function () {
        $.ajax({
            url: "/api/lotissemnts/getAll",
            method: "GET",
            success: function (response) {
                response = response.data
                if (response && response.length > 0) {
                    var options = '';
                    response.forEach(function (lotissement) {
                        let code = lotissement.code_lotissement
                        options += '<option value="' + code + '">' + lotissement.nom + '</option>';
                    });
                    $('#lotissement_select').html(options);
                }
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
        var id = $(this).attr('id');
        $.ajax({
            url: "/api/appel-offre/getById/" + id,
            method: "GET",
            success: function (response) {
                $("#appel_name").html(response.nom);
                $("#current_appel_id").val(response.id_appel);
                $('#card-al').removeClass('d-sm-none');
                reloadTable(id);
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });

    $("#add_appel_lot").click(function () {
        var lot = $('#lot_select').val();
        var id_appel = $('#current_appel_id').val();

        $.ajax({
            url: "/api/appelLot/create",
            method: "POST",
            data: { id_appel: id_appel, lot: lot },
            success: function (response) {
                reloadTable(id_appel);
                $("#appelMod").modal('hide');
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });

    $('#appelOffTable tbody').on('click', '.delete-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        var id = data.id_appel;

        $.ajax({
            url: "/api/appel-offre/delete/" + id,
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

    $("#clear").click(function () {
        $("#id_appel_offre").val("0");
        $("#nom_af").val("");
        $("#num_af").val("");
        $("#date_af").val("");
        $("#date_lim_af").val("");
    });

    $("#save_appel_offre").click(function () {
        var idAppelOffre = $("#id_appel_offre").val();
        var nom_af = $("#nom_af").val();
        var num_af = $("#num_af").val();
        var date_af = $("#date_af").val();
        var date_lim_af = $("#date_lim_af").val();


        var url = "";
        var method = "";

        if (idAppelOffre === "0") {
            method = "POST";
            url = "/api/appel-offre/create";
        } else {
            url = "/api/appel-offre/update/" + idAppelOffre;
            method = "PUT";
        }

        $.ajax({
            url: url,
            method: method,
            data: { nom: nom_af, num_appel: num_af, date_creation: date_af, date_limite: date_lim_af, id_resp: localStorage.getItem('userid') },
            success: function (response) {
                console.log(response);
                $("#id_appel_offre").val("0");
                $("#nom_af").val("");
                $("#num_af").val("");
                $("#date_af").val("");
                $("#date_lim_af").val("");
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
