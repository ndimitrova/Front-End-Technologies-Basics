window.addEventListener("load", solve);

function solve() {
    let customerNameInput = document.getElementById('customer-name');
    let chooseBaseInput = document.getElementById('base-choice');
    let chooseFruitInput = document.getElementById('fruit-choice');
    let sweetenerAmountInput = document.getElementById('sweetener-amount');
    

    let customizeCustomerName = document.getElementById('preview-name');
    let customizeChooseBase = document.getElementById('preview-base');
    let customizeChooseFruit = document.getElementById('preview-fruit');
    let customizeSweetenerAmount = document.getElementById('preview-sweetener');

    let orderPreviewElement = document.getElementById('order-preview');

    let customizeOrderButton = document.getElementById('order-btn');
    customizeOrderButton.addEventListener("click", previewOrders);

    function previewOrders() {
        
        orderPreviewElement.style.display = "block";

        customizeCustomerName.textContent = customerNameInput.value;
        customizeChooseBase.textContent = chooseBaseInput.value;
        customizeChooseFruit.textContent = chooseFruitInput.value;
        customizeSweetenerAmount.textContent = sweetenerAmountInput.value;

        customizeOrderButton.disabled = true;

        customerNameInput.value = "";
        chooseBaseInput.value = "Choose Base";
        chooseFruitInput.value = "Choose Fruit";
        sweetenerAmountInput.value = "";
    }

    let editButton = document.getElementById("edit-btn");

    editButton.addEventListener("click", onEdit);

    function onEdit() {
        customerNameInput.value = customizeCustomerName.textContent;
        chooseBaseInput.value = customizeChooseBase.textContent;
        chooseFruitInput.value = customizeChooseFruit.textContent;
        sweetenerAmountInput.value = customizeSweetenerAmount.textContent;
      
        customizeOrderButton.disabled = false;

        orderPreviewElement.style.display = "none";
    }

    let confirmButton = document.getElementById("confirm-btn");

    confirmButton.addEventListener("click", confirmSmoothie);

    let orderSuccsessElement = document.getElementById("order-success")

    function confirmSmoothie() {
        orderPreviewElement.style.display = "none";

        orderSuccsessElement.style.display = "block";
    }

    let backButton = document.getElementById("back-btn");
    backButton.addEventListener("click", onBack);

    function onBack() {
        orderSuccsessElement.style.display = "none";
        customizeOrderButton.disabled = false;
    }
}
  