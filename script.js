document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".rsvp-form");
    const nameInput = document.querySelector(".rsvp-input");
    const radioButtons = document.querySelectorAll("input[name='attendance']");
    const radioContainer = document.querySelector(".rsvp-options"); // Блок с радио-кнопками
    const button = document.querySelector(".rsvp-button");

    // Функция отображения ошибки
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

    // Функция очистки ошибки
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
        let error = radioContainer.querySelector(".error-message");

        if (!isChecked) {
            if (!error) {
                error = document.createElement("div");
                error.classList.add("error-message");
                error.textContent = "Выберите один из вариантов";
                radioContainer.appendChild(error);
            }
            return false;
        } else {
            if (error) error.remove();
            return true;
        }
    }

    // Обработчик отправки формы
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Останавливаем стандартную отправку формы

        const isNameValid = validateName();
        const isRadioValid = validateRadio();

        if (isNameValid && isRadioValid) {
            const name = nameInput.value.trim();
            const attendance = [...radioButtons].find(radio => radio.checked).value;

            button.disabled = true;
            button.style.backgroundColor = "#A0A9A3";
            button.textContent = "Отправка...";
            
            try {
                await sendDataToGoogleSheets(name, attendance);
                window.location.href = `response.html?attendance=${attendance}`;
            } catch (error) {
                console.error("Ошибка:", error);
    
                // Если ошибка, активируем кнопку обратно
                button.disabled = false;
                button.textContent = "Отправить";
            }
        }
    });

    // Функция отправки данных в Google Sheets
    async function sendDataToGoogleSheets(name, attendance) {
        const data = { name, attendance };
        await fetch("https://script.google.com/macros/s/AKfycbw7pQnNj2noyPRb2f_daHROFAnGHNYar3Ri-6sVRL_Bn9p3QDFzELH7MVLQrWvEDo55nQ/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .catch(error => {
            console.error("Ошибка:", error);
        });
    }
});