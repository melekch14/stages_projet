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
      
    var table = $("#lotTable").DataTable({

        ajax: "/api/lot/get-All",
        columns: [
            { data: 'code_lot' },
            { data: 'lotiss' },
            { data: 'surface' },
            { data: 'vocation' },
            { data: 'cuf' },
            { data: 'cos' },
            { data: 'hauteur' },
            { data: 'nb_niveau' },
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

    // Load the lotissements for the dropdown list
    $.ajax({
        url: "/api/lotissemnts/getAll",
        method: "GET",
        success: function (response) {
            response = response.data
            if (response && response.length > 0) {
                var options = '';
                response.forEach(function (lotissement) {
                    options += '<option value="' + lotissement.code_lotissement + '">' + lotissement.nom + '</option>';
                });
                $('#lotissement_select').html(options);
            }
        },
        error: function (error) {
            console.log(error);
            // Handle error
        }
    });

    $.ajax({
        url: "/api/vocation/getAll",
        method: "GET",
        success: function (response) {
            response = response.data
            if (response && response.length > 0) {
                var options = '';
                response.forEach(function (vocation) {
                    options += '<option value="' + vocation.code_vocation + '">' + vocation.label + '</option>';
                });
                $('#vocation_select').html(options);
            }
        },
        error: function (error) {
            console.log(error);
            // Handle error
        }
    });

    $('#lotTable tbody').on('click', '.modify-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        
        $("#lotissement_select").val(data.lotissement);
        $("#cos").val(data.cos);
        $("#cuf").val(data.cuf);
        $("#hauteur").val(data.hauteur);
        $("#surface").val(data.surface);
        $("#nb_niveau").val(data.nb_niveau);
        $("#vocation_select").val(data.vocation);
        $("#lot_code").val(data.code_lot);
        $("#code_lot").val(data.code_lot);
        $("#exampleModal").modal("show");
    });

    $('#lotTable tbody').on('click', '.delete-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        var id = data.code_lot;

        $.ajax({
            url: "/api/lot/delete/" + id,
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
        $("#code_lot").val("");
        $("#lotissement_select").val("");
        $("#cuf").val("");
        $("#cos").val("");
        $("#surface").val("");
        $("#hauteur").val("");
        $("#vocation_select").val("");
        $("#nb_niveau").val("");
        $("#lot_code").val("0");
    });

    $("#save_lot").click(function () {
        var code_lot = $("#code_lot").val();
        var lotissementId = $("#lotissement_select").val();
        var cuf = $("#cuf").val();
        var cos = $("#cos").val();
        var idLot = $("#lot_code").val();
        var surface = $("#surface").val();
        var vocation = $("#vocation_select").val();
        var hauteur = $("#hauteur").val();
        var nb_niveau = $("#nb_niveau").val();
        var url = "";
        var method = "";

        if (idLot === "0") {
            method = "POST";
            url = "/api/lot/create";
        } else {
            url = "/api/lot/update/" + idLot;
            method = "PUT";
        }

        $.ajax({
            url: url,
            method: method,
            data: { code_lot: code_lot, surface: surface, cuf: cuf, cos: cos, hauteur: hauteur, nb_niveau: nb_niveau, lotissement: lotissementId, vocation: vocation },
            success: function (response) {
                console.log(response);
                $("#code_lot").val("");
                $("#lotissement_select").val("");
                $("#cuf").val("");
                $("#cos").val("");
                $("#surface").val("");
                $("#hauteur").val("");
                $("#vocation_select").val("");
                $("#nb_niveau").val("");
                $("#lot_code").val("0");
                table.ajax.reload();
                $("#exampleModal").modal("hide");
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    });
});
