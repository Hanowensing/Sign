document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Main page loaded");

    const userInfo = JSON.parse(localStorage.getItem("googleUser"));
    const access_token = localStorage.getItem("access_token");

    if (!userInfo) {
        window.location.href = "index.html";
    } else {
        console.log("👤 로그인한 사용자:", userInfo);

        const header = document.querySelector("header");
        const userProfile = document.createElement("div");
        userProfile.classList.add("user-profile");
        userProfile.innerHTML = `<img src="${userInfo.picture}" alt="User Profile" class="user-img">`;
        header.appendChild(userProfile);
    }

    // ✅ 버튼 컨테이너 생성 (플러스 + 휴지통 버튼 같이 정렬)
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // ✅ "+" 버튼 (새로운 사인 추가)
    const plusButton = document.createElement("button");
    plusButton.classList.add("plus-btn");
    plusButton.textContent = "+";

    // ✅ 휴지통 버튼 (선택적 삭제)
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");
    trashButton.innerHTML = "🗑️"; // 휴지통 아이콘

    buttonContainer.appendChild(plusButton);
    buttonContainer.appendChild(trashButton);
    document.querySelector("header").appendChild(buttonContainer);

    let isSelectionMode = false;  // ✅ 선택 모드 활성화 여부
    let selectedSigns = new Set(); // ✅ 선택된 사인의 인덱스 저장

    // ✅ "+" 버튼 클릭 이벤트 (새로운 사인 추가 페이지로 이동)
    plusButton.addEventListener("click", function () {
        window.location.href = "create.html";
    });

    // ✅ 휴지통 버튼 클릭 시 삭제 모드 활성화 (사진 아래 radio 버튼 추가)
    trashButton.addEventListener("click", function () {
        if (isSelectionMode) {
            // ✅ 선택된 사인 삭제
            if (selectedSigns.size === 0) {
                alert("삭제할 사인을 선택하세요!");
                return;
            }
            if (confirm("선택한 사인을 삭제하시겠습니까?")) {
                deleteSelectedSigns();
            }
            isSelectionMode = false;
        } else {
            isSelectionMode = true;
        }
        updateSelectionMode();
    });

    // ✅ 저장된 사인 불러오기
    loadSavedSigns();

    /**
     * ✅ 저장된 사인을 불러와 화면에 표시하는 함수
     */
    function loadSavedSigns() {
        const container = document.getElementById("savedSignContainer");
        if (!container) {
            console.error("❌ 오류: savedSignContainer 요소가 없음");
            return;
        }

        let savedSigns = JSON.parse(localStorage.getItem("savedSigns")) || [];
        console.log("📂 불러온 데이터:", savedSigns);

        let noSignMessage = document.querySelector(".no-sign-message");
        if (!noSignMessage) {
            noSignMessage = document.createElement("h3");
            noSignMessage.textContent = "저장된 사인이 없습니다.";
            noSignMessage.classList.add("no-sign-message");
            container.parentElement.insertBefore(noSignMessage, container);
        }
        noSignMessage.style.display = savedSigns.length === 0 ? "block" : "none";

        container.innerHTML = "";

        savedSigns.forEach((signData, index) => {
            console.log(`🖼️ 이미지 추가: ${signData.imageUrl}`);

            const signCard = document.createElement("div");
            signCard.classList.add("sign-card");
            signCard.dataset.index = index; // ✅ 인덱스 저장

            // ✅ 이미지 추가
            const imgElem = document.createElement("img");
            imgElem.src = signData.imageUrl;
            imgElem.alt = "Saved Signature";
            imgElem.classList.add("sign-image");

            imgElem.onerror = function () {
                console.error(`❌ 이미지 로드 실패: ${signData.imageUrl}`);
                this.src = "default-sign.png";
                this.alt = "이미지 로드 실패";
            };

            // ✅ 삭제 선택을 위한 라디오 버튼 추가 (기본적으로 숨김)
            const radioElem = document.createElement("input");
            radioElem.type = "radio";
            radioElem.name = "signSelection"; // 하나만 선택 가능하도록 그룹 지정
            radioElem.classList.add("delete-radio");
            radioElem.dataset.index = index;
            radioElem.style.display = "none"; // 기본적으로 숨김

            signCard.appendChild(imgElem);
            signCard.appendChild(radioElem);
            container.appendChild(signCard);
        });

        updateSelectionMode(); // 선택 모드 적용
    }

    /**
     * ✅ 선택 모드 UI 업데이트 (radio 버튼 표시/숨김)
     */
    function updateSelectionMode() {
        document.querySelectorAll(".delete-radio").forEach(radio => {
            radio.style.display = isSelectionMode ? "block" : "none";
        });
    }

    /**
     * ✅ 선택한 사인을 삭제하는 함수
     */
    function deleteSelectedSigns() {
        let savedSigns = JSON.parse(localStorage.getItem("savedSigns")) || [];
        let newSigns = savedSigns.filter((_, index) => {
            const radio = document.querySelector(`.delete-radio[data-index="${index}"]`);
            return !radio || !radio.checked; // 체크된 항목만 삭제
        });

        localStorage.setItem("savedSigns", JSON.stringify(newSigns));
        selectedSigns.clear();
        loadSavedSigns(); // UI 업데이트
    }
});
