document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".rsvp-form");
    const nameInput = document.querySelector(".rsvp-input");
    const radioButtons = document.querySelectorAll("input[name='attendance']");
    const submitButton = document.querySelector(".rsvp-button");

    // Функция для отображения ошибки
    function showError(input, message) {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-message")) {
            error = document.createElement("div");
            error.classList.add("error-message");
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        error.textContent = message;
        input.classList.add("error");
    }

    // Функция для очистки ошибки
    function clearError(input) {
        let error = input.nextElementSibling;
        if (error && error.classList.contains("error-message")) {
            error.remove();
        }
        input.classList.remove("error");
    }

    // Валидация имени
    function validateName() {
        const nameValue = nameInput.value.trim();
        const namePattern = /^[А-Яа-яЁёA-Za-z\s]+$/; // Разрешаем только буквы и пробелы
        if (nameValue === "") {
            showError(nameInput, "Введите ваше имя");
            return false;
        } else if (!namePattern.test(nameValue)) {
            showError(nameInput, "Имя должно содержать только буквы");
            return false;
        } else {
            clearError(nameInput);
            return true;
        }
    }

    // Проверка выбора радио-кнопки
    function validateRadio() {
        const isChecked = [...radioButtons].some(radio => radio.checked);
        if (!isChecked) {
            showError(radioButtons[0].parentNode, "Выберите один из вариантов");
            return false;
        } else {
            clearError(radioButtons[0].parentNode);
            return true;
        }
    }

    // Функция отправки данных в Google Sheets
    function sendDataToGoogleSheets() {
        const nameValue = nameInput.value.trim();
        const attendanceValue = [...radioButtons].find(radio => radio.checked).value;

        const data = {
            name: nameValue,
            attendance: attendanceValue
        };

        fetch("https://script.google.com/macros/s/AKfycbw7pQnNj2noyPRb2f_daHROFAnGHNYar3Ri-6sVRL_Bn9p3QDFzELH7MVLQrWvEDo55nQ/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            alert("Спасибо! Ваш ответ записан.");
            form.reset(); // Очищаем форму после успешной отправки
        })
        .catch(error => {
            console.error("Ошибка:", error);
            alert("Ошибка отправки данных. Попробуйте позже.");
        });
    }

    // Обработчик отправки формы
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Останавливаем отправку формы

        const isNameValid = validateName();
        const isRadioValid = validateRadio();

        if (isNameValid && isRadioValid) {
            sendDataToGoogleSheets(); // Отправка данных, если всё ок
        }
    });
});