
const country1Input = document.getElementById('country1');
const country2Input = document.getElementById('country2');
const outputDiv = document.getElementById('output');

if (document.getElementById('submitBtn')) {
  document.getElementById('submitBtn').addEventListener('click', () => {
    const country1 = country1Input.value;
    const country2 = country2Input.value;

    fetch(`http://localhost:3000/getDiffLang?country1=${country1}&country2=${country2}`)
      .then(response => response.json())
      .then(data => {
        const languages = data.map(obj => obj.language);
        const outputTable = document.createElement('table');
        const header = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.innerText = 'Languages';
        header.appendChild(headerCell);
        outputTable.appendChild(header);
        languages.forEach(language => {
          const row = document.createElement('tr');
          const cell = document.createElement('td');
          cell.innerText = language;
          row.appendChild(cell);
          outputTable.appendChild(row);
        });
        outputDiv.innerHTML = '';
        outputDiv.appendChild(outputTable);
      })
      .catch(err => {
        console.error(err);
        outputDiv.innerHTML = 'Error';
      });
  });
}

if (document.getElementById('submitBtn2')) {
  const country1Inputt = document.getElementById('country3');
  const country2Inputt = document.getElementById('country4');
  const outputDivv = document.getElementById('output2');
  document.getElementById('submitBtn2').addEventListener('click', () => {
    const country1 = country1Inputt.value;
    const country2 = country2Inputt.value;

    fetch(`http://localhost:3000/getDiffLangJoin?country1=${country1}&country2=${country2}`)
      .then(response => response.json())
      .then(data => {
        const languages = data.map(obj => obj.language);
        const outputTable = document.createElement('table');
        const header = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.innerText = 'Languages';
        header.appendChild(headerCell);
        outputTable.appendChild(header);
        languages.forEach(language => {
          const row = document.createElement('tr');
          const cell = document.createElement('td');
          cell.innerText = language;
          row.appendChild(cell);
          outputTable.appendChild(row);
        });
        outputDivv.innerHTML = '';
        outputDivv.appendChild(outputTable);
      })
      .catch(err => {
        console.error(err);
        outputDivv.innerHTML = 'Error';
      });
  });
}

if (document.getElementById('getLifeExpectancyBtn')) {
  const operationSelect = document.getElementById('operationType');
  const countryInput = document.getElementById('countryName');
  const outputDivvv = document.getElementById('outputDiv');
  document.getElementById('getLifeExpectancyBtn').addEventListener('click', () => {
    
    const operation = operationSelect.value;
    const country = countryInput.value;

    fetch(`http://localhost:3000/aggregateCountries?operation=${operation}&country=${country}`)
      .then(response => response.json())
      .then(data => {
        
        let columns = '';
        for (const key in data[0]) {
          columns += `<th>${key}</th>`;
        }
        outputDivvv.innerHTML = `<table><thead><tr>${columns}</tr></thead><tbody>` + 
          data.map(country => {
            columns = '';
            for (const key in country) {
              columns += `<td>${country[key]}</td>`;
            }
            return `<tr>${columns}</tr>`;
          }).join('') + 
          '</tbody></table>';

      })
      .catch(err => {
        console.error(err);
        outputDivvv.innerHTML = 'Error';
      });
  });
}
