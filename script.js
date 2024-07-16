$(document).ready(function() {
    $.getJSON('http://127.0.0.1:5000/api/items', function(data) {
        const tableBody = $('#itemTable tbody');
        
        data.forEach(item => {
            const price = parseFloat(item.price);
            const craftPrice = parseFloat(item.craft);
            const brisageValue = parseFloat(item.brisage_value.replace(/\s/g, '').replace('N/A', '0'));
            differencePrice = isNaN(brisageValue) ? 0 : brisageValue - price;
            differencePrice = isNaN(differencePrice) ? 0 : differencePrice;
            differenceCraftPrice = isNaN(brisageValue) ? 0 : brisageValue - craftPrice;
            differenceCraftPrice = isNaN(differenceCraftPrice) ? 0 : differenceCraftPrice;
            const row = `
                <tr>
                    <td>${item.item}</td>
                    <td>${price}</td>
                    <td>${craftPrice}</td>
                    <td>${item.brisage_value}</td>
                    <td>${differencePrice}</td>
                    <td>${differenceCraftPrice}</td>
                </tr>
            `;
            tableBody.append(row);
        });

        $('#itemTable').DataTable({
            lengthMenu: [ [10, 25, 50, 100, -1], [10, 25, 50, 100, 'All'] ],
            pageLength: 10, // Nombre de lignes par page par défaut
            columnDefs: [
                { type: 'num', targets: [1, 2, 3, 4, 5] } // Appliquer un type numérique aux colonnes où cela est nécessaire
            ]
        });
    });
});
