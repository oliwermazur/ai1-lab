class Todo {
    constructor() {
        this.zadania = JSON.parse(localStorage.getItem('zadania')) || [];
    }

    dodajZadanie(opisZadania, termin) {
        if (opisZadania.length < 3 || opisZadania.length > 255) return;
        if (termin && new Date(termin) < new Date()) return;

        this.zadania.push({ tekst: opisZadania, termin, zakonczone: false });
        this.rysuj();
        this.zapiszZadania();
    }

    usunZadanie(indeks) {
        this.zadania.splice(indeks, 1);
        this.rysuj();
        this.zapiszZadania();
    }

    edytujZadanie(indeks, nowyOpis, nowyTermin) {
        if (nowyOpis.length < 3 || nowyOpis.length > 255) return;
        if (nowyTermin && new Date(nowyTermin) < new Date()) return;

        this.zadania[indeks] = { ...this.zadania[indeks], tekst: nowyOpis, termin: nowyTermin };
        this.rysuj();
        this.zapiszZadania();
    }

    zapiszZadania() {
        localStorage.setItem('zadania', JSON.stringify(this.zadania));
    }

    rysuj() {
        const listaZadanEle = document.getElementById('listaZadan');
        listaZadanEle.innerHTML = '';

        this.zadania.forEach((zadanie, indeks) => {
            const elementZadania = document.createElement('li');
            elementZadania.id = 'zadanie-' + indeks;
            elementZadania.style.display = 'flex';
            elementZadania.style.justifyContent = 'space-between';
            elementZadania.style.alignItems = 'center';

            const kontenerOpisTermin = document.createElement('div');

            const elementTekstu = document.createElement('span');
            elementTekstu.className = 'tekst-zadania';
            elementTekstu.textContent = zadanie.tekst;
            kontenerOpisTermin.appendChild(elementTekstu);

            const elementTerminu = document.createElement('span');
            if (zadanie.termin) {
                elementTerminu.textContent = ` ${zadanie.termin}`;
                elementTerminu.style.fontWeight = 'bold';
                elementTerminu.style.marginLeft = '10px';
            }
            kontenerOpisTermin.appendChild(elementTerminu);

            elementZadania.appendChild(kontenerOpisTermin);

            const przyciskAkcji = document.createElement('button');
            przyciskAkcji.textContent = 'Usuń';
            przyciskAkcji.className = 'przycisk-usun';
            przyciskAkcji.onclick = () => this.usunZadanie(indeks);
            elementZadania.appendChild(przyciskAkcji);

            elementZadania.addEventListener('click', (event) => {
                if (event.target !== elementZadania && event.target !== elementTekstu && event.target !== elementTerminu) return;

                elementTekstu.innerHTML = '';
                const inputEdycji = document.createElement('input');
                inputEdycji.type = 'text';
                inputEdycji.value = zadanie.tekst;
                inputEdycji.className = 'input-edycji';
                elementTekstu.appendChild(inputEdycji);

                const inputTerminu = document.createElement('input');
                inputTerminu.type = 'date';
                inputTerminu.value = zadanie.termin;
                inputTerminu.className = 'input-terminu';
                elementTerminu.innerHTML = '';
                elementTerminu.appendChild(inputTerminu);

                przyciskAkcji.textContent = 'Zapisz';
                przyciskAkcji.className = 'przycisk-zapisz';
                przyciskAkcji.onclick = () => {
                    this.edytujZadanie(indeks, inputEdycji.value, inputTerminu.value);
                    this.rysuj();
                };

                inputEdycji.focus();
            });

            listaZadanEle.appendChild(elementZadania);
        });
    }
}

const todo = new Todo();
todo.rysuj();

document.getElementById('dodajZadanie').onclick = () => {
    const tekstNowegoZadania = document.getElementById('noweZadanie').value;
    const terminZadania = document.getElementById('terminZadania').value;
    todo.dodajZadanie(tekstNowegoZadania, terminZadania);
    document.getElementById('noweZadanie').value = '';
    document.getElementById('terminZadania').value = '';
};

document.getElementById('znajdzZadanie').oninput = (e) => {
    const szukanyTekst = e.target.value.toLowerCase();

    todo.zadania.forEach((zadanie, indeks) => {
        const elementZadania = document.getElementById('zadanie-' + indeks);
        const elementTekstuZadania = elementZadania.querySelector('.tekst-zadania');

        elementTekstuZadania.innerHTML = zadanie.tekst;
        if (szukanyTekst) {
            const regex = new RegExp(`(${szukanyTekst})`, 'gi');
            elementTekstuZadania.innerHTML = zadanie.tekst.replace(regex, `<mark>$1</mark>`);
        }

        elementZadania.style.display = zadanie.tekst.toLowerCase().includes(szukanyTekst) ? '' : 'none';
    });
};
