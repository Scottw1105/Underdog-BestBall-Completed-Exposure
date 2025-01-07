var lineup_info = [["Tournament_Name", "Buy_In", "Draft Entry", 'Pick_Position', 'Build', 'Name', 'Position', 'Team', 'ADP' ,'Pick']]

var tourneyName = document.querySelector(".styles__title__P5hN8").textContent.trim();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function exportToCSV(filename, csvData) {
    const csvBlob = new Blob([csvData], { type: "text/csv" });
    const csvURL = URL.createObjectURL(csvBlob);

    const a = document.createElement("a");
    a.href = csvURL;
    a.download = filename;

    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(csvURL);
}

async function get_exposures() {
    // Get all the lineup Div's
    const entries = Array.from(document.querySelectorAll(".styles__draftCell__pWlSX"));
    
    await sleep(250);
    document.querySelector(".styles__infoIcon__Ac3ZD").click();
    await sleep(250);
    const buy_in = document.querySelector(".styles__entryInfoValue__qx_JF").textContent.trim();
    await sleep(250);
    document.querySelector(".styles__closeButton__ZYuEF").click();

    for (var i = 0; i < entries.length; i++) {
        await entries[i].click();
        await sleep(750);
        //Gather base info for each lineup that will be the same amongst all players in each lineup. Draft ID, Pick Position, Build. 
        var lineup_base = [];

        lineup_base.push(tourneyName, buy_in);

        var draft_id = entries[i].getAttribute("data-draft-id");
        lineup_base.push(draft_id);

        var pick_position = document.querySelector(".styles__pickAndProjectionValue__Ugzds").textContent.trim();
        lineup_base.push(pick_position);

        var build = Array.from(document.querySelectorAll(".styles__positionCount__J96ya"));
        let qb = build[0].textContent.trim();
        let rb = build[1].textContent.trim();
        let wr_te = build[2].textContent.trim();
        // let te = build[3].textContent.trim();
        let build_list = `${qb}-${rb}-${wr_te}`;
        lineup_base.push(build_list);

        // Get all player DIVs
        const positions = Array.from(document.querySelectorAll(".styles__positionSection__N_raC"));
        for (position = 0; position < positions.length; position++) {

            const players = Array.from(positions[position].querySelectorAll(".styles__playerPickCell__JCEIA"));
            var player_pos = positions[position].querySelector(".styles__positionHeader__R2EgT").textContent.trim();
            var player_list = [];
            for (var player = 0; player < players.length; player++) {
                temp_list = [];
                var Name = players[player].querySelector(".styles__infoValue__abWUk").textContent.trim();
                var Team = players[player].querySelector(".styles__infoKey__u67Lp").textContent.trim();
                var add_info = Array.from(players[player].querySelector(".styles__additionalInfo__gNhRa").querySelectorAll(".styles__infoValue__abWUk"));
                var adp = add_info[1].textContent.trim();
                var pick = add_info[2].textContent.trim();
                
                temp_list = temp_list.concat(lineup_base);
                temp_list.push(Name, player_pos, Team, adp, pick);
            
                lineup_info.push(temp_list);
            };
        };
        await sleep(1500);
    }
    console.log(lineup_info);
    exportToCSV(tourneyName, lineup_info.join("\n"));
};

get_exposures()
