let currentTab = 'all';
const tabActive = 'btn-primary';
const tabInActive = 'btn-soft';
const openStatus = 'border-green-400';
const closedStatus = 'border-violet-400';

const allTabContainer = document.getElementById("all-container");
const openTabContainer = document.getElementById("open-container");
const closedTabContainer = document.getElementById("closed-container");
const availableIssue = document.getElementById("available-issue");


function switchTab(tab) {
    currentTab = tab;
    const tabs = ['all', 'open', 'closed'];
    for (const t of tabs) {
        const tabName = document.getElementById(t + "-tab");
        
        if ( tab === t)  {
            tabName.classList.add(tabActive);
            tabName.classList.remove(tabInActive);
        }
        else {
            tabName.classList.remove(tabActive);
            tabName.classList.add(tabInActive);
        }
    }

    const pages = [allTabContainer, openTabContainer, closedTabContainer];
    for (const section of pages) {
        section.classList.add('hidden');
    }
    
    if (tab === 'all'){
        allTabContainer.classList.remove('hidden');
    }
    else if (tab === 'open'){
        openTabContainer.classList.remove('hidden');
    }
    else {
        closedTabContainer.classList.remove('hidden');
    }
    updateIssue();
}
switchTab(currentTab);

const loadIssue = async() => {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    const response = await fetch(url);
    const data = await response.json();
    const allIssue = displayIssue(data.data);
}
const loadModalIssue = async(id) =>{
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    const response = await fetch(url);
    const details = await response.json();
    displayModalIssue(details.data);
}

const createLabels = (arr) => {
    const htmlElement = arr.map(el => `<span class = "btn mr-2 mt-2 btnLevel">${el}</span>`);
    return htmlElement.join(" ");
}
const displayIssue = (issues) => {
    allTabContainer.innerHTML = "";
    openTabContainer.innerHTML = "";
    closedTabContainer.innerHTML = "";
    issues.forEach(issue =>{
        const card = document.createElement("div");
        card.innerHTML = `
            <div onclick="loadModalIssue(${issue.id})" id="card-container" class="bg-white p-4 rounded-xl border-t-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)] h-full">
                <div>
                    <div class="flex justify-between items-center mb-4 priority-high hidden">
                        <div class="bg-green-400 p-1 rounded-full">
                            <img src="assets/Open-Status.png" alt="">
                        </div>
                        <button class="btn btnHigh">${issue.priority.toUpperCase()}</button>
                    </div>
                    <div class="flex justify-between items-center mb-4 priority-medium hidden">
                        <div class="bg-green-400 p-1 rounded-full">
                            <img src="assets/Open-Status.png" alt="">
                        </div>
                        <button class="btn btnMedium">${issue.priority.toUpperCase()}</button>
                    </div>
                    <div class="flex justify-between items-center mb-4 priority-low hidden">
                        <div class="bg-violet-400 p- rounded-full">
                            <img src="assets/Closed- Status .png" alt="">
                        </div>
                        <button class="btnLow">${issue.priority.toUpperCase()}</button>
                    </div>
                </div>
                <div class="border-b border-gray-200 space-y-2 pb-4">
                    <h2 class="font-semibold text-sm">${issue.title}</h2>
                    <p class="text-neutral/50 text-[12px]">${issue.description}</p>
                    <div>${createLabels(issue.labels)}</div>
                </div>
                <div class="space-y-1 pt-4">
                    <div class="flex justify-between items-center">
                        <p class="text-neutral/50 text-[10px]">#${issue.id} by ${issue.author}</p>
                        <p class="text-neutral/50 text-[10px]">${issue.createdAt}</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-neutral/50 text-[10px]">Assignee: ${issue.assignee ? issue.assignee : 'juabaiar'}</p>
                        <p class="text-neutral/50 text-[10px]">Updated: ${issue.updatedAt}</p>
                    </div>
                </div>
            </div>
        `;
        allTabContainer.append(card);

        const highPriority = card.querySelector(".priority-high");
        const mediumPriority = card.querySelector(".priority-medium");
        const lowPriority = card.querySelector(".priority-low");
        const allPriority =[highPriority, mediumPriority, lowPriority];
        for(const pr of allPriority){
            pr.classList.add("hidden");
        }
        const currentPriority = issue.priority;
        if (currentPriority === 'high') {
            highPriority.classList.remove('hidden');
        }
        else if (currentPriority === 'medium') {
            mediumPriority.classList.remove('hidden');
        }
        else{
            lowPriority.classList.remove('hidden');
        }

        // status
        const box = card.querySelector('div');
        const currentStatus = issue.status;
        if (currentStatus === 'open') {
            box.classList.add(openStatus);
            box.classList.remove(closedStatus);
        }
        else {
            box.classList.remove(openStatus);
            box.classList.add(closedStatus);
        }

        const copyIssue = card.cloneNode(true);
        const status = issue.status;
        if (status === 'open'){
            openTabContainer.appendChild(copyIssue);
        }
        else {
            closedTabContainer.appendChild(copyIssue);
        }
    })
    updateIssue();
}
function updateIssue() {
    const count = {
    all: allTabContainer.children.length,
    open: openTabContainer.children.length,
    closed: closedTabContainer.children.length
}
availableIssue.innerText = count[currentTab];
}
document.getElementById("search-btn").addEventListener("Click", () => {
    const searchIssueInput = document.getElementById("Search-issue");
    const searchIssue = searchIssueInput.value.trim().toLowerCase();

    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    fetch(url)
        .then(response => response.json())
        .then(data =>{
            const allIssue = data.data;
            const filterIssue = allIssue.filter(el =>el.title.toLowerCase().includes(searchIssue));
            displayIssue(filterIssue);
        })
})
const displayModalIssue = (issue) =>{
    const modalContainer = document.getElementById("modal-content");
    modalContainer.innerHTML = ` 
                <h2 class="text-2xl font-bold">${issue.title}</h2>
                <div class = "flex gap-5 items-center">
                    <span class = "btnStatus text-white">${issue.status}</span>
                    <li class = "text-neutral/50 text-[12px]">${issue.author}</li>
                    <li class = "text-neutral/50 text-[12px]">${issue.createdAt}</li>
                </div>
                <div>${createLabels(issue.labels)}</div>
                <p class="text-neutral/50">${issue.description}</p>
                <div class="bg-base-200 p-3 rounded-xl flex items-center justify-between">
                    <div class = "space-y-1">
                        <p class="text-neutral/50">Assignee:</p>
                        <span class="font-semibold">${issue.assignee ? issue.assignee : "Jubaiar"}</span>
                    </div>
                    <div class = "space-y-2">
                        <p class="text-neutral/50">Priority:</p>
                        <span class = "btnHigh">${issue.priority}</span>
                    </div>
                </div>
    `;
    document.getElementById("my_modal").showModal();
}
loadIssue();