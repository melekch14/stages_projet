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

    $.ajax({
        url: "/api/appel-offre/getAll",
        method: "GET",
        success: function (response) {
            response = response.data
            if (response && response.length > 0) {
                var options = '';
                options += '<option value="0">Sélectionner appel d offre</option>';
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


    $("#display_dep").on("click", function () {
        var appel = $('#appel_select').val();
        if (appel != 0) {
            displayAllData(appel)
            generateTableOffre(appel);
            displayPerSecteur(appel);
        }
    });

    function displayAllData(id) {
        $.ajax({
            url: "/api/lot/getByAppel/" + id,
            method: "GET",
            success: function (response) {
                const lotNames = response.data.map(item => item.code_lot);
                const surfaces = response.data.map(item => item.surface);
                const vocations = response.data.map(item => item.vocation);

                $.ajax({
                    url: "/data/" + id,
                    method: "GET",
                    success: function (response1) {

                        // Extracting "data" and "lotNames" from the parsed JSON
                        const data = response1.data;
                        data.sort(function (a, b) {
                            return a.id_offre - b.id_offre;
                        });

                        generateTable(data, lotNames, surfaces, vocations);

                    },
                    error: function (error) {
                        console.log(error);
                        // Handle error
                    }
                });
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    }

    // Function to generate the table dynamically
    function generateTable(data, lotNames, surfaces, vocations) {
        var table = $('#dataTable');
        table.html("");
        table.html("<tr><th colspan='3' style='border: none; background-color: white;'></th></tr>" +
            "<tr><th colspan='3' style='border: none; background-color: white;'></th></tr>" +
            "<tr><th colspan='3' style='border: none; background-color: white;'></th></tr>");
        var headerRow = table.find('tr:first');
        var secondRow = table.find('tr').eq(1);
        var thirdRow = table.find('tr').eq(2);

        // Generate header cells for lot names
        $.each(lotNames, function (index, lotName) {
            headerRow.append('<th colspan="3">' + lotName + '</th>');
        });

        $.each(surfaces, function (index, surf) {
            secondRow.append('<th colspan="3">' + surf + '</th>');
        });

        $.each(vocations, function (index, voc) {
            thirdRow.append('<th colspan="3">' + voc + '</th>');
        });

        // Generate header cells for main table
        var mainHeaderRow = '<tr>' +
            '<th>N° Offre</th>' +
            '<th></th>' +
            '<th>Participant</th>';

        $.each(lotNames, function (index, lotName) {
            mainHeaderRow += '<th>Principale</th><th>Op 1</th><th>Op 2</th>';
        });

        mainHeaderRow += '</tr>';
        table.append(mainHeaderRow);

        // Generate table rows with data
        $.each(data, function (index, sousOffre) {
            var row = '<tr>' +
                '<td>' + sousOffre.id_offre + '</td>' +
                '<td>' + sousOffre.id_sous_offre + '</td>' +
                '<td>' + sousOffre.participant + '</td>';

            // Generate cells for each lot's data
            $.each(lotNames, function (index, lotName) {
                var lotData = sousOffre.lots[lotName];
                if (lotData) {
                    row += '<td class="lot-principal" data-lot-name="' + lotName + '">' + lotData.lot_principal.toFixed(3) + '</td>' +
                        '<td class="lot-option1" data-lot-name="' + lotName + '">' + lotData.lot_option1.toFixed(3) + '</td>' +
                        '<td class="lot-option2" data-lot-name="' + lotName + '">' + lotData.lot_option2.toFixed(3) + '</td>';
                } else {
                    row += '<td class="lot-principal" data-lot-name="' + lotName + '"></td><td class="lot-option1" data-lot-name="' + lotName + '"></td><td class="lot-option2" data-lot-name="' + lotName + '"></td>';
                }
            });

            row += '</tr>';
            table.append(row);
        });

        table.on('click', '.lot-principal, .lot-option1, .lot-option2', function () {
            var cellValue = $(this).text();
            var rowIndex = $(this).closest('tr').index();
            var colIndex = $(this).index();
            var columnHeader = table.find('tr:eq(3) th:eq(' + colIndex + ')').text();
            var lotName = $(this).data('lot-name');

            // Get the second element in the row
            var secondElement = $(this).closest('tr').find('td:eq(1)').text();
            var participant = $(this).closest('tr').find('td:eq(2)').text();
            $("#lot_code").html(lotName);
            $("#part_name").html(participant);
            $("#id_offre").val(secondElement);
            $("#soumMod").modal('show');
            switch (columnHeader) {
                case "Principale": $("#Principale").val(cellValue); break;
                case "Op 1": $("#option1").val(cellValue); break;
                case "Op 2": $("#option2").val(cellValue); break;

            }
            if ($("#Principale").val() == "" && $("#option1").val() == "" && $("#option2").val() == "") {
                $("#operation").val("add");
            } else {
                $("#operation").val("update");
            }
        });
    }

    $('#soumMod').on('hidden.bs.modal', function () {
        $("#lot_code").html("");
        $("#part_name").html("");
        $("#id_offre").val("");
        $("#Principale").val("");
        $("#option1").val("");
        $("#option2").val("");
    });

    $("#add_soum").click(function () {
        var principal = $("#Principale").val();
        principal = parseFloat(principal.replace(',', '.'));
        var option1 = $("#option1").val();
        var option1 = parseFloat(option1.replace(',', '.'));
        var option2 = $("#option2").val();
        var option2 = parseFloat(option2.replace(',', '.'));
        var lot = $('#lot_code').html();
        var id_soum = $("#id_offre").val();
        var operation = $("#operation").val();


        var url = "";
        var method = "";
        if (operation == "add") {
            url = "/api/soumission/create/";
            method = "POST"
        } else {
            url = "/api/soumission/updates/";
            method = "PUT"
        }

        $.ajax({
            url: url,
            method: method,
            data: { option1: option1, option2: option2, principal: principal, id_s_offre: id_soum, lot: lot },
            success: function (response) {

                displayAllData($("#appel_select").val())
                generateTableOffre($("#appel_select").val());
                displayPerSecteur($("#appel_select").val());
                $("#soumMod").modal('hide');
            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });

    });



    function generateTableOffre(id) {
        $.ajax({
            url: "/api/rapport/getAll/" + id,
            method: "GET",
            success: function (response) {
                const jsonData = response;


                $.ajax({
                    url: "/api/rapport/getOffre/" + id,
                    method: "GET",
                    success: function (response1) {

                        $.ajax({
                            url: "/api/lot/getByAppel/" + id,
                            method: "GET",
                            success: function (dat) {
                                dat = dat.data;
                                var data = response1;
                                const allLots = dat.map(item => item.code_lot);

                                // Sort the jsonData based on the lot property
                                jsonData.sort((a, b) => a.lot.localeCompare(b.lot));

                                const nbSArray = jsonData.map(item => item.nbS);
                                const prixArray = jsonData.map(item => "3 500,000");
                                const sumArray = jsonData.map(item => item.sum_of_three_columns_avg.toFixed(3));
                                const maxArray = jsonData.map(item => item.max_value.toFixed(3));
                                const surfaceArray = jsonData.map(item => item.surface);
                                const lotArray = jsonData.map(item => item.lot);
                                const chiffreAffaireArray = maxArray.map((max, index) => (max * surfaceArray[index]).toFixed(3));

                                data.sort((a, b) => a.lot.localeCompare(b.lot));

                                const lotParticipantsMap = new Map();
                                data.forEach(item => {
                                    if (lotParticipantsMap.has(item.lot)) {
                                        lotParticipantsMap.get(item.lot).push(item.nom);
                                    } else {
                                        lotParticipantsMap.set(item.lot, [item.nom]);
                                    }
                                });

                                const offre = {};
                                lotArray.forEach(lot => {
                                    if (lotParticipantsMap.has(lot)) {
                                        offre[lot] = lotParticipantsMap.get(lot);
                                    } else {
                                        offre[lot] = [];
                                    }
                                });

                                const offreArray = Object.entries(offre).map(([lot, participants]) => ({ lot, participants }));

                                // Step 1: Create a Set with all unique lots
                                const uniqueLotsSet = new Set([...new Set(allLots), ...new Set(lotArray)]);

                                // Step 2: Add missing lots to the end of lotArray and offreArray
                                uniqueLotsSet.forEach(lot => {
                                    if (!lotArray.includes(lot)) {
                                        lotArray.push(lot);
                                        offreArray.push({ lot, participants: [] });

                                        // Add corresponding values for the missing lot in other arrays
                                        nbSArray.push(0);
                                        prixArray.push(0);
                                        sumArray.push(0);
                                        maxArray.push(0);
                                        surfaceArray.push(0);
                                        chiffreAffaireArray.push(0);
                                    }
                                });

                                // Assuming the rest of your code remains unchanged

                                const result = {
                                    nbS: nbSArray,
                                    prix: prixArray,
                                    prixMoyenne: sumArray,
                                    meilleurOffre: maxArray,
                                    offre: offreArray,
                                    chiffreAffaire: chiffreAffaireArray,
                                    lot: lotArray
                                };
                                console.log(result);
                                createTable(result);


                            },
                            error: function (error) {
                                console.log(error);
                                // Handle error
                            }
                        });



                    },
                    error: function (error) {
                        console.log(error);
                        // Handle error
                    }
                });

            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    }


    // Function to create and populate the table
    function createTable(data) {
        console.log(data);
        const table = document.getElementById('dataTables');
        table.innerHTML = "";

        // Create header row for lot names
        const headerLotRow = document.createElement('tr');
        headerLotRow.innerHTML = '<th colspan="3">Lots</th><th colspan="3">' + data.lot.join('</th><th colspan="3">') + '</th>';
        table.appendChild(headerLotRow);

        // Create header row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th colspan="3">Nombre soumission par lot</th><td colspan="3">' + data.nbS.join('</td><td colspan="3">') + '</td>';
        table.appendChild(headerRow);

        // Create prix row
        const prixRow = document.createElement('tr');
        prixRow.innerHTML = '<th colspan="3">prix</th><td colspan="3">' + (data.prix).join('</td><td colspan="3">') + '</td>';
        table.appendChild(prixRow);

        // Create prix moyenne row
        const prixMoyenneRow = document.createElement('tr');
        prixMoyenneRow.innerHTML = '<th colspan="3">prix moyenne</th><td colspan="3">' + data.prixMoyenne.join('</td><td colspan="3">') + '</td>';
        table.appendChild(prixMoyenneRow);

        // Create meilleur offre row
        const meilleurOffreRow = document.createElement('tr');
        meilleurOffreRow.innerHTML = '<th colspan="3">Meilleur offre</th><td colspan="3">' + data.meilleurOffre.join('</td><td colspan="3">') + '</td>';
        table.appendChild(meilleurOffreRow);

        // Create offre rows
        const offreRow = document.createElement('tr');
        offreRow.innerHTML = '<th colspan="3">offre</th>';

        data.lot.forEach(lot => {
            const lotData = data.offre.find(item => item.lot === lot);

            if (lotData) {

                for (let i = 0; i < 3; i++) {
                    if (lotData.participants[i]) {
                        offreRow.innerHTML += '<td class="offre-cell">' + lotData.participants[i] + '</td>';
                    } else {
                        offreRow.innerHTML += '<td class="offre-cell"></td>';
                    }
                }
            } else {
                for (let i = 0; i < 3; i++) {
                    offreRow.innerHTML += '<td class="offre-cell"></td>';
                }
            }
        });

        table.appendChild(offreRow);

        // Create chiffre d'affaire row
        const chiffreAffaireRow = document.createElement('tr');
        chiffreAffaireRow.innerHTML = '<th colspan="3">Chiffre d\'affaire</th><td colspan="3">' + data.chiffreAffaire.join('</td><td colspan="3">') + '</td>';
        table.appendChild(chiffreAffaireRow);


    }




    // par secteur

    function displayPerSecteur(id) {
        $.ajax({
            url: "/api/rapport/getStat/" + id,
            method: "GET",
            success: function (data1) {

                $.ajax({
                    url: "/api/rapport/getChiffre/" + id,
                    method: "GET",
                    success: function (data2) {

                        var mergedData = mergeDataForSecteur(data1, data2);

                        $('#secteur').html("");

                        var table = $('<table class="dataTable">').addClass('merged-table');
                        var headerRow = $('<tr>').appendTo(table);
                        $('<th>').text('Secteur').appendTo(headerRow);
                        $('<th>').text('Total Chiffre d\'Affaire').appendTo(headerRow);
                        $('<th>').text('Nombre de soumission').appendTo(headerRow);
                        $('<th>').text('Prix Moyenne').appendTo(headerRow);
                        $('<th>').text('Prix minimum').appendTo(headerRow);
                        $('<th>').text('prix maximum').appendTo(headerRow);

                        $.each(mergedData, function (index, item) {
                            var row = $('<tr>').appendTo(table);
                            $('<td>').text(item.vocation).appendTo(row);
                            $('<td>').text(item.total_chiffre_d_affaire.toFixed(3)).appendTo(row);
                            $('<td>').text(item.count_sum).appendTo(row);
                            $('<td>').text(item.avg.toFixed(3)).appendTo(row);
                            $('<td>').text(item.min_sum.toFixed(3)).appendTo(row);
                            $('<td>').text(item.max_sum.toFixed(3)).appendTo(row);
                        });

                        // Append the table to a container (e.g., a div with ID "table-container")
                        $('#secteur').append(table);

                    },
                    error: function (error) {
                        console.log(error);
                        // Handle error
                    }
                });

            },
            error: function (error) {
                console.log(error);
                // Handle error
            }
        });
    }



    function mergeDataForSecteur(data1, data2) {
        var mergedData = [];

        // Iterate through data1
        for (var i = 0; i < data1.length; i++) {
            var vocation = data1[i].vocation;

            // Find the matching element in data2
            var data2Match = data2.find(function (item) {
                return item.vocation === vocation;
            });

            // Merge the elements and add to the mergedData array
            if (data2Match) {
                var mergedItem = $.extend({}, data1[i], data2Match);
                mergedData.push(mergedItem);
            }
        }

        return mergedData;
    }



});