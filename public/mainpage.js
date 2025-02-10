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

    // ✅ "+" 버튼 (새로운 사인 추가)
    const plusButton = document.createElement("button");
    plusButton.classList.add("plus-btn");
    plusButton.textContent = "+";
    document.querySelector("header").appendChild(plusButton);

    // ✅ 휴지통 버튼 (선택적 삭제)
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");
    trashButton.innerHTML = "🗑️"; // 휴지통 아이콘
    document.querySelector("header").appendChild(trashButton);

    let isSelectionMode = false;  // ✅ 선택 모드 활성화 여부
    let selectedSigns = new Set(); // ✅ 선택된 사인의 인덱스 저장

    // ✅ "+" 버튼 클릭 이벤트 (새로운 사인 추가 페이지로 이동)
    plusButton.addEventListener("click", function () {
        window.location.href = "create.html";
    });

    // ✅ 휴지통 버튼 클릭 시 삭제 모드 활성화
    trashButton.addEventListener("click", function () {
        if (isSelectionMode) {
            // ✅ 선택된 사인만 삭제
            if (selectedSigns.size === 0) {
                alert("삭제할 사인을 선택하세요!");
                return;
            }
            if (confirm("선택한 사인을 삭제하시겠습니까?")) {
                deleteSelectedSigns();
            }
            isSelectionMode = false;
            trashButton.style.color = ""; // 색상 초기화
        } else {
            isSelectionMode = true;
            trashButton.style.color = "red"; // 삭제 모드 표시
            alert("삭제할 사인을 선택하세요!");
        }
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

            signCard.appendChild(imgElem);
            container.appendChild(signCard);

            // ✅ 사인 클릭 이벤트 (삭제 모드일 때만 동작)
            signCard.addEventListener("click", function () {
                if (!isSelectionMode) return;

                const index = signCard.dataset.index;
                if (selectedSigns.has(index)) {
                    selectedSigns.delete(index);
                    signCard.style.opacity = "1"; // 선택 해제
                } else {
                    selectedSigns.add(index);
                    signCard.style.opacity = "0.5"; // 선택됨 (반투명 효과)
                }
            });
        });
    }

    /**
     * ✅ 선택한 사인을 삭제하는 함수
     */
    function deleteSelectedSigns() {
        let savedSigns = JSON.parse(localStorage.getItem("savedSigns")) || [];
        let newSigns = savedSigns.filter((_, index) => !selectedSigns.has(index));

        localStorage.setItem("savedSigns", JSON.stringify(newSigns));
        selectedSigns.clear();
        loadSavedSigns(); // UI 업데이트
    }
});
