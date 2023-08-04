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

    var table = $("#vocationTable").DataTable({

        ajax: "/api/vocation/getAll",
        columns: [
            { data: 'code_vocation' },
            { data: 'label' },
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


    $('#vocationTable tbody').on('click', '.modify-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        // Fill the input fields with the data from the clicked row
        $("#code_vocation").val(data.code_vocation);
        $("#label").val(data.label);
        $("#vocation_code").val(data.code_vocation);
        $("#exampleModal").modal("show");
    });


    $('#vocationTable tbody').on('click', '.delete-button', function () {
        var dataTable = $(this).closest('table').DataTable();
        var data = dataTable.row($(this).closest('tr')).data();
        var id = data.code_vocation;

        $.ajax({
            url: "/api/vocation/delete/" + id,
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
        $("#code_vocation").val("");
        $("#label").val("");
        $("#vocation_code").val("0");
    });

    $("#save_vocation").click(function () {

        var code_vocation = $("#code_vocation").val();
        var label = $("#label").val();
        var id_vocation = $("#vocation_code").val();
        var url = "";
        var method = "";
        if (id_vocation == 0) {
            method = "POST";
            url = "/api/vocation/create";
        } else {
            url = "/api/vocation/update/" + id_vocation;
            method = "PUT";
        }


        $.ajax({
            url: url,
            method: method,
            data: { code_vocation: code_vocation, label: label },
            success: function (response) {
                console.log(response);
                $("#code_vocation").val("");
                $("#label").val("");
                $("#vocation_code").val("0");
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