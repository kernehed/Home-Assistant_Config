class iCloud3EventLogCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
//---------------------------------------------------------------------------
     setConfig(config) {
        const cardTitle = "iCloud3 Event Log"

        const root = this.shadowRoot;
        const hass = this._hass;

        // Create card elements
        const card = document.createElement('ha-card');
        const background = document.createElement('div');
        background.id = "background";

        // Title Bar
        const titleBar = document.createElement("div");
        titleBar.id = "titleBar";
        const title = document.createElement("div");
        title.id = "title";
        title.textContent = cardTitle
        const thisButtonId = document.createElement("div");
        thisButtonId.id = "thisButtonId";
        thisButtonId.innerText = "setup";
        thisButtonId.style.setProperty('color', 'white');

        // Button Bar
        const buttonBody = document.createElement("body");
        buttonBody.id = "buttonBody";
        buttonBody.class = "buttonBody";
        const buttonBar0 = document.createElement("div");
        buttonBar0.id = "buttonBar0";
        buttonBar0.class = "buttonBarTop";
        const buttonBarCmd = document.createElement("div");
        buttonBarCmd.id = "buttonBarCmd";
        buttonBarCmd.class = "buttonBarCmd";
        const buttonBar1 = document.createElement("div");
        buttonBar1.id = "buttonBar1";
        buttonBar1.class = "buttonBarBot";
        buttonBar1.style.setProperty('visibility', 'hidden');


        // Buttons
        const btnName0     = document.createElement('btnName');
        btnName0.id        = "btnName0";
        btnName0.classList.add("btnClassSelect");
        btnName0.style.setProperty('visibility', 'hidden');
        const btnName1     = document.createElement('btnName');
        btnName1.id        = "btnName1";
        btnName1.classList.add("btnClassSelect");
        btnName1.style.setProperty('visibility', 'hidden');
        const btnName2     = document.createElement('btnName');
        btnName2.id        = "btnName2";
        btnName2.classList.add("btnClassSelect");
        btnName2.style.setProperty('visibility', 'hidden');
        const btnName3     = document.createElement('btnName');
        btnName3.id        = "btnName3";
        btnName3.classList.add("btnClassSelect");
        btnName3.style.setProperty('visibility', 'hidden');
        const btnName4     = document.createElement('btnName');
        btnName4.id        = "btnName4";
        btnName4.classList.add("btnClassSelect");
        btnName4.style.setProperty('visibility', 'hidden');
        const btnName5     = document.createElement('btnName');
        btnName5.id        = "btnName5";
        btnName5.classList.add("btnClassSelect");
        btnName5.style.setProperty('visibility', 'hidden');
        const btnName6     = document.createElement('btnName');
        btnName6.id        = "btnName6";
        btnName6.classList.add("btnClassSelect");
        btnName6.style.setProperty('visibility', 'hidden');
        const btnName7     = document.createElement('btnName');
        btnName7.id        = "btnName7";
        btnName7.classList.add("btnClassSelect");
        btnName7.style.setProperty('visibility', 'hidden');
        const btnName8     = document.createElement('btnName');
        btnName8.id        = "btnName8";
        btnName8.classList.add("btnClassSelect");
        btnName8.style.setProperty('visibility', 'hidden');
        const btnName9     = document.createElement('btnName');
        btnName9.id        = "btnName9";
        btnName9.classList.add("btnClassSelect");
        btnName9.style.setProperty('visibility', 'hidden');

        const btnRestart = document.createElement('btnName');
        btnRestart.id    = "btnRestart";
        btnRestart.style.setProperty('visibility', 'visible');
        btnRestart.classList.add("btnClassSelect");
        btnRestart.classList.add("btnClassCmd");

        const btnDebug = document.createElement('btnName');
        btnDebug.id    = "btnDebug";
        btnDebug.classList.add("btnClassSelect");
        btnDebug.classList.add("btnClassCmd");
        btnDebug.style.setProperty('visibility', 'visible');

        const btnRefresh = document.createElement('btnName');
        btnRefresh.id    = "btnRefresh";
        btnRefresh.classList.add("btnClassSelect");
        btnRefresh.classList.add("btnClassCmdRefresh");
        btnRefresh.style.setProperty('visibility', 'visible');

        // Message Bar
        const eltInfoBar = document.createElement("div");
        eltInfoBar.id = "eltInfoBar";
        const eltInfoName = document.createElement("div");
        eltInfoName.id = "eltInfoName";
        eltInfoName.innerText = "Select Person/Device";

        const eltInfoUpdateTime = document.createElement("div");
        eltInfoUpdateTime.id = "eltInfoUpdateTime";
        eltInfoUpdateTime.innerText = "setup";

        const eltContainer = document.createElement("div");
        eltContainer.id = "eltContainer";
        const eventLogTable = document.createElement("table");
        eventLogTable.id = "eventLogTable";

        // Style
        const style = document.createElement('style');
        style.textContent = `
            ha-card {
                background-color: var(--paper-card-background-color);
                padding: 10px;
            }
            #background {
                position: relative;
                height: 670px;
            }

            /* Title Bar set up */
            #titleBar {
                position: relative;
                display: inline-block;
                height: 20px;
                margin: 6px 0px 18px 0px;
                width: 100%;
                //border: 1px solid dodgerblue;
            }
            #title {
                //display: table-cell;
                height: 100%;
                width: 60%;
                text-align: left;
                font-size: 24px;
                margin: 0px 0px 0px 0px;
                float: left;
                vertical-align: middle;
                color: var(--primary-text-color);
                //border: 1px solid red;
            }
            #thisButtonId {
                height: 100%;
                width: 10%;
                margin: 0px 0px 0px 0px;
                color: green;
                font-size: 10px;
                //border: 1px solid green;
            }

            /* Message Bar setup */
            #eltInfoBar {
                position: relative;
                height: 18px;
                margin: 0px 10px 12px 0px;
                width: 100%;
                //border: 1px solid dodgerblue;
            }
            #eltInfoName {
                height: 18px;
                width: 40%;
                color: indianred;
                float: left;
                font-size: 14px;
                font-weight: 400;
                //border: 1px solid red;
            }
            #eltInfoUpdateTime {
                height: 18px;
                width: 60%;
                //padding: 0px 6px 0px 0px;
                color: indianred;
                float: right;
                text-align: right;
                font-size: 14px;
                font-weight: 400;
                //border: 1px solid green;
            }

            /* Event Log Table Setup
            #eventLogTableHdr {
                position: relative;
                margin: 0px 0px;
                height: 25px
                width: 100%;
            }*/
            #eventLogTable {
                position: relative;
                margin: 0px 0px;
                width: 100%;
            }

            #eventLogTableOverlay {
                background-color: green:
            }
            /* Scrollbar */
            ::-webkit-scrollbar {width: 16px;}
            ::-webkit-scrollbar-track {background: #f1f1f1;}
            ::-webkit-scrollbar-thumb {background: #D2D6D9;}
            ::-webkit-scrollbar-thumb:hover {background: #818181;}

            /* Event Log Table */
            .eltTable {
                position: sticky;
                //display: table-header-group;
                display: block;
                table-layout: fixed;
                width: 426px;
                //border: 1px solid red;
                border-collapse: collapse;

            }
            .eltHeader {
                position: sticky;
                table-layout: fixed;
                display: block;
                height: 14px;
                padding: 2px 0px 4px 0px;
                background-color: #d8ecf3;
                border-collapse: collapse;
                border-top: 1px solid #9dd3e2;
                border-bottom: 1px solid #9dd3e2;//darkgray;
            }
            .eltHeader tr {
                display: block;
            }
            .eltBody {
                display: block;
                table-layout: fixed;
                height: 548px;
                border-collapse: collapse;
                overflow-y: scroll;
                overflow-x: hidden;
                -webkit-overflow-scrolling: touch;
            }
            .eltBody tr {
                width: 408px;
                z-index: 1;
            }

            .eltBody tr:nth-child(odd) {background-color: white;}
            //.eltBody tr:nth-child(even) {background-color: #E5E5E5;}
            .eltBody tr:nth-child(even) {background-color: #F0F0F0;}

            .hdrTime     {width: 65px; text-align: left; color: g;}
            .hdrState    {width: 100px; text-align: left; color: black;}
            .hdrZone     {width: 100px; text-align: left; color: black;}
            .hdrInterval {width: 65px; text-align: right; color: black;}
            .hdrTravTime {width: 65px; text-align: right; color: black;}
            .hdrDistance {width: 65px; text-align: right; color: black;}
            .hdrScroll   {width: 14px;}

            .colTime     {width: 62px; color: silver;}
            .colState    {width: 100px; color: silver;}
            .colZone     {width: 100px; color: silver;}
            .colInterval {width: 67px; text-align: right; color: silver;}
            .colTravTime {width: 67px; text-align: right; color: silver;}
            .colDistance {width: 67px; text-align: right; color: silver;}

            .updateEdgeBar {border-left-style: solid; border-left-color:
                            dodgerblue; border-left-width: thick;}
            .rowBorder   {border-left: 2px solid cyan;}

             // Text special colors
            .iosappRecd  {color: teal;}
            .errorMsg    {color: red;}
            .updateRecd  {color: white; background-color: dodgerblue; font-weight: 450;}
            .trigger     {color: black; font-weight: 300;}
            .updateItem  {color: black;}
            .ic3StartupMsg {color: white; background-color: mediumorchid; font-weight: 450;}
            .dateRecd    {color: white; background-color: darkred;}
            .event       {colspan: 5;}

            .blue        {color: blue;}
            .teal        {color: teal;}
            .darkgray    {color: darkgray;}
            .dimgray     {color: dimgray;}
            .black       {color: black}
            .red         {color: red;}
            .highlight_row  {color: red;}
            .highlight_item {color: silver;}
            .highlight_itemChg {color: silver;}
            .darkred     {color: darkred;}
            .green       {color: green;}
            .redChg {
                color: red;
            }
            //    text-decoration: underline;
            //    text-decoration-style: double;
            //    -webkit-text-decoration-color: green; /* Safari */
            //    text-decoration-color: green;
            //}
            .redbox {
                border: 1px solid red;
                border-collapse: collapse;
            }

            /* Buttons */
            #buttonBody {
                position: relative;
                width: 100%;
                border: 1px solid red;
            }
            .buttonBarTop {
                position: relative;
                height: 25px;
                margin: 8px 0px 8px 0px;
                width: 100%;
                border: 1px solid blue;
            }
            .buttonBarBot {
                position: relative;
                height: 25px;
                margin: 8px 0px 8px 0px;
                width: 100%;
                border: 1px solid green;
            }

            .btnClassSelect {
                display: inline-block;
                padding: 2px 4px;
                border: 1px solid #0080F0;
                background-color: transparent;
                margin: 0px 4px 4px 0px;
                border-radius: 2px;
                box-sizing: border-box;
                text-decoration: none;
                text-align: center;
                font-weight: 500;
                color: #0080F0;
                text-align: center;
            }
            .btnClassCmd {
                border: 1px solid darkred;
                color: darkred;
            }
            .btnClassCmdRefresh {
                //padding: 2px 8px;
                border: 1px solid darkgreen;
                //margin: 0px 14px 4px 0px;
                color: darkgreen;
            }
            #btnDebug {
                color:  darkred;
                border: 1px solid darkred;
                background-color: transparent;
            }
            #btnRestart {
                color:  darkred;
                border: 1px solid darkred;
                background-color: transparent;
            }
            #btnRefresh {
                color:  darkgreen;
                border: 1px solid darkgreen;
                background-color: transparent;
            }


            /* iPhone with smaller screen */
            @media only screen and (max-device-width: 640px),
                only screen and (max-device-width: 667px),
                only screen and (max-width: 480px) {
                    ha-card       {padding: 4px 4px 4px 4px;}
                    //#eltInfoBar   {width: 100%;}
                    //#thisButtonId {font-size: 8px;}
                    .eltTable     {width: 360px;}
                    .eltHeader    {background-color: #ebf6f9;
                                   height: 15px;
                                   padding: 0px 0px 3px 0px;}
                    .eltHeader tr {width: 360px;}
                    .eltBody tr   {width: 360px;}
                    .btnClassSelect {margin: 0px 2px 4px 0px; padding: 1px 3px;)
                    .btnClassCmdRefresh {margin: 0px 1px 4px 0px;)
                    .hdrTime     {width: 65px;}
                    .hdrState    {width: 72px;}
                    .hdrZone     {width: 72px;}
                    .hdrInterval {width: 55px;}
                    .hdrTravTime {width: 55px;}
                    .hdrDistance {width: 55px;}
                    .hdrScroll   {width: 2px;}

                    .colTime     {width: 60px;}
                    .colState    {width: 70px;}
                    .colZone     {width: 70px;}
                    .colInterval {width: 60px;}
                    .colTravTime {width: 60px;}
                    .colDistance {width: 60px;}

                    .updateRecd  {font-weight: 450;}
                    .updateEdgeBar {border-left-width: thick;}
                    .ic3StartupMsg {font-weight: 450;}

                    .eltBody tr:nth-child(even) {background-color: #EEF2F5;}
                    //.eltBody tr:nth-child(even) {background-color: oldlace;}
                    ::-webkit-scrollbar {width: 1px;}
                    ::-webkit-scrollbar-thumb {background: #818181;}
                }
            /* iPad ??? */
            @media only screen
                and (min-device-width : 768px)
                and (max-device-width : 1024px) {
                     .hdrTime     {width: 65px;}
                    .hdrState    {width: 102px;}
                    .hdrZone     {width: 102px;}
                    .hdrInterval {width: 72px;}
                    .hdrTravTime {width: 72px;}
                    .hdrDistance {width: 72px;}
                    .hdrScroll   {width: 2px;}

                    .colTime     {width: 67px;}
                    .colState    {width: 100px;}
                    .colZone     {width: 100x;}
                    .colInterval {width: 72px;}
                    .colTravTime {width: 72px;}
                    .colDistance {width: 72px;}

                    .updateRecd  {font-weight: 450;}
                    .updateEdgeBar {border-left-width: thick;}
                    .ic3StartupMsg {font-weight: 450;}


                    .eltBody tr:nth-child(even) {background-color: #EEF2F5;}
                    ::-webkit-scrollbar {width: 1px;}
                    ::-webkit-scrollbar-thumb {background: #818181;}
                }

        `;

        // Build title
        titleBar.appendChild(title);
        titleBar.appendChild(thisButtonId);

        // Build Message Bar
        eltInfoBar.appendChild(eltInfoName);
        eltInfoBar.appendChild(eltInfoUpdateTime);

        // Create Buttons
        buttonBar0.appendChild(btnName0);
        buttonBar0.appendChild(btnName1);
        buttonBar0.appendChild(btnName2);
        buttonBar0.appendChild(btnName3);
        buttonBar0.appendChild(btnName4);
        buttonBar0.appendChild(btnRestart);
        buttonBar0.appendChild(btnDebug);
        buttonBar0.appendChild(btnRefresh);

        buttonBar1.appendChild(btnName5);
        buttonBar1.appendChild(btnName6);
        buttonBar1.appendChild(btnName7);
        buttonBar1.appendChild(btnName8);
        buttonBar1.appendChild(btnName9);

        buttonBody.appendChild(buttonBar0)
        buttonBody.appendChild(buttonBar1)

        eltContainer.appendChild(eventLogTable)

        // Create Background
        background.appendChild(titleBar)
        background.appendChild(buttonBar0)
        background.appendChild(buttonBar1)
        background.appendChild(eltInfoBar)
        background.appendChild(eltContainer)
        background.appendChild(style);

        card.appendChild(background);
        root.appendChild(card);

        // Click & Mouse Events
        for (let i = 0; i < 10; i++) {
            let buttonId = 'btnName' + i
            let button     = root.getElementById(buttonId)

            button.addEventListener("mousedown", event => { this._buttonPress(buttonId); });
            button.addEventListener("mouseover", event => { this._btnClassMouseOver(buttonId); });
            button.addEventListener("mouseout",  event => { this._btnClassMouseOut(buttonId); });
        }

        btnRestart.addEventListener("mousedown", event => { this._buttonPress("btnRestart"); });
        btnRestart.addEventListener("mouseover", event => { this._btnClassMouseOver("btnRestart"); });
        btnRestart.addEventListener("mouseout",  event => { this._btnClassMouseOut("btnRestart"); });

        btnDebug.addEventListener("mousedown", event => { this._buttonPress("btnDebug"); });
        btnDebug.addEventListener("mouseover", event => { this._btnClassMouseOver("btnDebug"); });
        btnDebug.addEventListener("mouseout",  event => { this._btnClassMouseOut("btnDebug"); });

        btnRefresh.addEventListener("mousedown", event => { this._buttonPress("btnRefresh"); });
        btnRefresh.addEventListener("mouseover", event => { this._btnClassMouseOver("btnRefresh"); });
        btnRefresh.addEventListener("mouseout",  event => { this._btnClassMouseOut("btnRefresh"); });

        btnRefresh.innerText = "Refresh";
        btnDebug.innerText   = "Debug";
        btnRestart.innerText = "Restart iC3";


        // Add to root
        this._config = config;
    }

    // Create card.
//---------------------------------------------------------------------------
    set hass(hass) {
        /* Hass will do this on a regular basis. If this is the first time
        through, set up the button names. otherwise, display the event table.
        */
        const root   = this.shadowRoot;
        const config = this._config;
        this._hass = hass;
        const thisButtonId   = root.getElementById("thisButtonId")
        const updateTimeAttr = hass.states['sensor.icloud3_event_log'].attributes['update_time']
        const eltInfoUpdateTime = root.getElementById("eltInfoUpdateTime")

        if (eltInfoUpdateTime.innerText == "setup") {
            this._setupButtonNames()
            this._buttonPress(this._currentButtonId())
        }

        //if (eltInfoUpdateTime.innerText !== updateTimeAttr) {
        if (eltInfoUpdateTime.innerText.indexOf(updateTimeAttr) == -1) {
            this._setupEventLogTable('hass')
        }
    }

//---------------------------------------------------------------------------
     _setupButtonNames() {
        /* Cycle through the sensor.icloud3_event_log attributes and
        build the names on the buttons, and make them visible.
        */
        const root   = this.shadowRoot;
        const hass   = this._hass;
        const thisButtonId = root.getElementById("thisButtonId")
        const btnDebug     = root.getElementById('btnDebug')
        const btnRestart   = root.getElementById('btnRestart')
        const btnRefresh   = root.getElementById('btnRefresh')
        const filtername   = hass.states['sensor.icloud3_event_log'].attributes['filtername']
        const logLevelDebug= hass.states['sensor.icloud3_event_log'].attributes['log_level_debug']
        const namesAttr    = hass.states['sensor.icloud3_event_log'].attributes['names']
        const names        = Object.values(namesAttr)
        var msg = '', i
        var buttonPressId = ''

        for (i = 0; i < names.length; i++) {
            let buttonId = 'btnName' + i

            //Get button for data in current sensor.icloud3_event_log
            if (filtername == names[i]) {
                buttonPressId = buttonId
            }

            var button = root.getElementById(buttonId)
            button.innerText = names[i]
            button.style.setProperty('visibility', 'visible');
        }
        if (names.length < 6) {
            var buttonBar1 = root.getElementById("buttonBar1");
            buttonBar1.style.setProperty('height', '1px');
        }

        //If filtername=Initilize or some error occurs, use first button
        if (buttonPressId == '') {
            buttonPressId = 'btnName0'
        }
        thisButtonId.innerText = buttonPressId

        btnRefresh.style.color = "darkgreen"
        btnRefresh.style.background_color = "transparent"

        if (logLevelDebug == 'On') {
            btnDebug.style.color = "white"
            btnDebug.style.backgroundColor = "darkred"
        } else {
            btnDebug.style.color = "darkred"
            btnDebug.style.backgroundColor = "transparent"
        }

        btnDebug.style.cssFloat = "right"
        btnRestart.style.cssFloat = "right"
        btnRefresh.style.cssFloat = "right"
    }

//---------------------------------------------------------------------------
     _setupEventLogTable(devicenameParm) {
        /* Cycle through the sensor.icloud3_event_log attributes and
        build the event log table
        */
        const root = this.shadowRoot;
        const hass = this._hass;
        const eventLogTable    = root.getElementById("eventLogTable");
        var logAttr = hass.states['sensor.icloud3_event_log'].attributes['logs']

        const eltInfoNameID = root.getElementById("eltInfoName")
        const eltInfoUpdateTime = root.getElementById("eltInfoUpdateTime")
        const logLevelDebug = hass.states['sensor.icloud3_event_log'].attributes['log_level_debug']
        const btnDebug     = root.getElementById('btnDebug')
        var eltInfoName = eltInfoNameID.innerText
        var devicenameX = eltInfoName.indexOf("(")+1
        var devicename  = eltInfoName.slice(devicenameX,-1)
        this.style.display = 'block';

        let row = 0
        var sameTextCnt = 0
        var eltRowId
        var lText = ''

        const userAgentStr = navigator.userAgent
        var iPhone = 'no'
        var userAgent    = userAgentStr.indexOf("iPhone")
        if (userAgent > 0) {
            iPhone = 'yes'
        }
        var iPad = 'no'
        var userAgent    = userAgentStr.indexOf("iPad")
        if (userAgent > 0) {
            iPad = 'yes'
        }

        let logTableHeadHTML = ''
        logTableHeadHTML += '<thead id="eltHeader">'
        logTableHeadHTML += '<tr class="eltHeader">'
        logTableHeadHTML += '<th class="hdrTime">Time</th>'
        logTableHeadHTML += '<th class="hdrState">State</th>'
        logTableHeadHTML += '<th class="hdrZone">Zone</th>'
        if (iPhone == 'yes') {
            logTableHeadHTML += '<th class="hdrInterval">Intervl</th>'
            logTableHeadHTML += '<th class="hdrTravTime">Travel</th>'
            logTableHeadHTML += '<th class="hdrDistance">Dist</th>'
        } else {
            logTableHeadHTML += '<th class="hdrInterval">Interval</th>'
            logTableHeadHTML += '<th class="hdrTravTime">Travel</th>'
            logTableHeadHTML += '<th class="hdrDistance">Distance</th>'
        }
        logTableHeadHTML += '<th class="hdrScroll"> </th>'
        logTableHeadHTML += '</tr></thead>'

        let logTableHTML = ''
        logTableHTML     += '<div class="eltTable">'
        logTableHTML     += '<table id ="eltTable" >'
        logTableHTML     += logTableHeadHTML
        logTableHTML     += '<tbody id="eltBody" class="eltBody">'

        /*
        Example of log file string:
        [['10:54:45', 'home', 'Home', '0 mi', '', '2 hrs', 'Update via iCloud Completed'],
        ['10:54:45', 'home', 'Home', '0 mi', '', '2 hrs', 'Interval basis: 4iz-InZone, Zone=home, Dir=in_zone'],
        ['10:54:45', 'home', 'Home', '0 mi', '', '2 hrs', 'Location Data Prepared (27.72682, -80.390507)'],
        ['10:54:45', 'home', 'Home', '0 mi', '', '2 hrs', 'Preparing Location Data'], ['10:54:45', 'home', 'Home', '0 mi', '', '2 hrs', 'Update via iCloud, nextUpdateTime reached'],
        ['10:54:33', 'home', 'Home', '0 mi', '', '2 hrs', 'Update cancelled, Old location data, Age 18.9 min, Retry #1']]

        Data extraction steps:
        1. Drop '[[' and ']]' at each end.
        2. Split on '], ][' to create a list item for each record.
        3. Cycle through list records. Split on ', ' to create each element.
        */

        if (eltInfoUpdateTime.innerText == "iCloud3 Restarting") {
            logTableHTML += '<tr class = "eltRow">'
            logTableHTML += '<td>iCloud3 Restarting</td>'
            logTableHTML += '</tr>'

        } else if (logAttr.length != 0) {
            var logEntriesRaw = logAttr.slice(2,-2)
            var logEntries    = logEntriesRaw.split('], [',99999)
            var i, eltRow
            var classUpdateEdgeBar = ''
            var completed_item__highlight_next_row = false
            
            //alert(logEntries)
            for (i = 0; i < logEntries.length-1; i++) {
                var thisRecd  = logEntries[i].split("', '",10)
                //alert(i+"  "+thisRecd)
                var tTime     = thisRecd[0].slice(1)
                var tState    = thisRecd[1]
                var tZone     = thisRecd[2]
                var tInterval = thisRecd[3]
                var tTravTime = thisRecd[4]
                var tDistance = thisRecd[5]
                var tText     = thisRecd[6].slice(0,-1)

                var nextRecd  = logEntries[i+1].split("', '",10)
                var nTime     = nextRecd[0].slice(1)
                var nState    = nextRecd[1]
                var nZone     = nextRecd[2]
                var nInterval = nextRecd[3]
                var nTravTime = nextRecd[4]
                var nDistance = nextRecd[5]
                var nText     = nextRecd[6].slice(0,-1)

                var thisRecdTestChg = tState + tZone + tInterval + tTravTime + tDistance
                var nextRecdTestChg = nState + nZone + nInterval + nTravTime + nDistance

                var chgState = ''
                var chgZone  = ''
                var chgIntvl = ''
                var chgTTime = ''
                var chgDist  = ''

                var classTime     = 'colTime'
                var classState    = 'colState'
                var classZone     = 'colZone'
                var classInterval = 'colInterval'
                var classTravTime = 'colTravTime'
                var classDistance = 'colDistance'


                if (tText == nText) {
                    ++sameTextCnt
                    if (sameTextCnt == 1) {var firstTime = tTime}
                    var sameTextTime = tTime
                    continue
                }
                if (sameTextCnt > 0) {
                    tTime = firstTime
                    tText += ' (+'+ sameTextCnt +' more times)'
                    sameTextCnt = 0
                }
                if (completed_item__highlight_next_row) {
                    classTime     += ' highlight_row'
                    classState    += ' highlight_row'
                    classZone     += ' highlight_row'
                    classInterval += ' highlight_row'
                    classTravTime += ' highlight_row'
                    classDistance += ' highlight_row'
                    completed_item__highlight_next_row = false
                    
                } else if (thisRecdTestChg !== nextRecdTestChg) {
                    classTime     += ' highlight_item'
                    //classState    += ' highlight_item'
                    //classZone     += ' highlight_item'
                    //classInterval += ' highlight_item'
                    //classTravTime += ' highlight_item'
                    //classDistance += ' highlight_item'

                    //if (tState    !== nState)    {classState    += 'Chg'}
                    //if (tZone     !== nZone)     {classZone     += 'Chg'}
                    //if (tInterval !== nInterval) {classInterval += 'Chg'}
                    //if (tTravTime !== nTravTime) {classTravTime += 'Chg'}
                    //if (tDistance !== nDistance) {classDistance += 'Chg'}

                } else if (row == 0) {
                    classTime     += ' red'
                    classState    += ' red'
                    classZone     += ' red'
                    classInterval += ' red'
                    classTravTime += ' red'
                    classDistance += ' red'
                }

                if (iPhone == 'yes') {
                    tInterval = tInterval.replace(' sec','s')
                    tInterval = tInterval.replace(' min','m')
                    tInterval = tInterval.replace(' hrs','h')
                    tInterval = tInterval.replace(' hr','h')

                    tTravTime = tTravTime.replace(' sec','s')
                    tTravTime = tTravTime.replace(' min','m')
                    tTravTime = tTravTime.replace(' hrs','h')
                    tTravTime = tTravTime.replace(' hr','h')

                    tDistance  = tDistance.replace(' mi','mi')
                    tDistance  = tDistance.replace(' km','km')
                }

                var classEventMsg = 'trigger'

                classTime    += classUpdateEdgeBar
                logTableHTML += '<tr class = "eltRow">'
                logTableHTML += '<td class="'+classTime +'">'+tTime    +'</td>'
                logTableHTML += '<td class="'+classState    +'">'+tState    +'</td>'
                logTableHTML += '<td class="'+classZone     +'">'+tZone   +'</td>'
                logTableHTML += '<td class="'+classInterval +'">'+tInterval+'</td>'
                logTableHTML += '<td class="'+classTravTime +'">'+tTravTime+'</td>'
                logTableHTML += '<td class="'+classDistance +'">'+tDistance+'</td>'
                logTableHTML += '</tr>'
                ++row

                var classStateEndEdge = ''

                //alert(tText)
                classEventMsg = 'updateItem'
                if (tText.indexOf("update started") >= 0) {
                    classEventMsg = 'updateRecd'
                    classTime     = 'updateRecd'
                    classUpdateEdgeBar = ''
                } else if (tText.indexOf("update complete") >= 0) {
                    completed_item__highlight_next_row = true
                    classEventMsg = 'updateRecd'
                    classTime     = 'updateRecd'
                    classUpdateEdgeBar = ' updateEdgeBar'
                } else if (tText.indexOf("__") >= 0) {
                    classEventMsg = 'updateItem'
                } else if (tText.indexOf("Trigger") >= 0) {
                    classEventMsg = 'iosappRecd'
                } else if (tText.indexOf("^^^") >= 0) {
                    classEventMsg = 'dateRecd'
                    classTime     = 'dateRecd'
                    tText = tText.replace("^^^", "")
                    tText = tText.replace("^^^", "")
                } else if (tText.indexOf("Initializing") >= 0) {
                    classEventMsg = 'ic3StartupMsg'
                    classTime     = 'ic3StartupMsg'
                } else if (tText.indexOf("Error") >= 0) {
                    classEventMsg = 'errorMsg'
                } else if (tText.indexOf("Failed") >= 0) {
                    classEventMsg = 'errorMsg'
                }

                classTime    += classUpdateEdgeBar
                logTableHTML += '<tr class = "eltRow">'
                logTableHTML += '<td class="'+classTime+'"></td>'
                logTableHTML += '<td class="'+classEventMsg+'"; colspan="5">'+tText+'</td>'
                logTableHTML += '</tr>'
                ++row

                if (row == 20) {
                    eventLogTable.innerHTML = logTableHTML + '</tbody>'
                    this._resize_header_width()
                }
            }
            logTableHTML += ''

        }

        logTableHTML += `</tbody></table></div>`;

        eventLogTable.innerHTML = logTableHTML;

        if (row < 20) {
            this._resize_header_width()
        }

        var updateTimeAttr  = hass.states['sensor.icloud3_event_log'].attributes['update_time']

        if (logLevelDebug == 'On') {
            btnDebug.style.color = "white"
            btnDebug.style.backgroundColor = "darkred"
            this._displayTimeName("Debug Logging On ... "+updateTimeAttr)
            //this._displayTimeName(updateTimeAttr)
        } else {
            btnDebug.style.color = "darkred"
            btnDebug.style.backgroundColor = "transparent"
            this._displayTimeName(updateTimeAttr)
        }
       //eltInfoUpdateTime.innerText = updateTimeAttr

        //this._hass.callService("device_tracker", "icloud3_update", {
        //    device_name: 'reset', command: 'event_log'})
    }

//---------------------------------------------------------------------------
    _resize_header_width() {
        const root        = this.shadowRoot;
        const hass        = this._hass;
        const eltInfoUpdateTime = root.getElementById("eltInfoUpdateTime")
        const eventLogTable     = root.getElementById("eventLogTable")
        const eventLogTableHdr  = root.getElementById("eltHeader")

        if (eltInfoUpdateTime.innerText !== "setup") {
            var colCnt = eventLogTable.rows[0].cells.length
            var msg = ''
            for (var i = 0; i < colCnt; i++) {
                var colWidth    = eventLogTable.rows[0].cells[i].offsetWidth
                var colBCRObj   = eventLogTable.rows[0].cells[i].getBoundingClientRect()
                var colWidthBCR = colBCRObj.width
                eventLogTableHdr.rows[0].cells[i].style.width = colWidthBCR+'px'
            }
        }
    }
//---------------------------------------------------------------------------
    _buttonPress(buttonPressId) {
        /* Handle the button press events. Get the devicename, do an 'icloud3_update'
        event_log devicename' service call to have the event_log attribute populated.
        */
        const root        = this.shadowRoot;

        const hass        = this._hass;
        this.namesAttr    = hass.states['sensor.icloud3_event_log'].attributes['names']
        const logLevelDebug= hass.states['sensor.icloud3_event_log'].attributes['log_level_debug']
        const namesAttr   = this.namesAttr

        const names       = Object.values(namesAttr)
        const devicenames = Object.keys(namesAttr)
        const thisButtonId = root.getElementById("thisButtonId")
        const btnRefresh   = root.getElementById('btnRefresh')
        const btnDebug     = root.getElementById('btnDebug')
        const btnRestart   = root.getElementById('btnRestart')
        const thisButtonPressed = root.getElementById(buttonPressId)
        const eltInfoUpdateTime = root.getElementById("eltInfoUpdateTime")

        var lastButtonId  = this._currentButtonId()
        var lastButtonPressed = root.getElementById(lastButtonId)

        if (buttonPressId == "btnRefresh") {
            if (lastButtonId == '') {
                return
            }

            var buttonPressX  = lastButtonId.substr(-1)

        } else if (buttonPressId == "btnDebug") {
            var buttonPressX  = lastButtonId.substr(-1)

        } else if (buttonPressId == "btnRestart") {
            var buttonPressX  = lastButtonId.substr(-1)

        } else {
            var buttonPressX  = buttonPressId.substr(-1)
            var eltInfoName = names[buttonPressX]+"  ("+devicenames[buttonPressX]+")"
            //var eltInfoName = devicenames[buttonPressX]

            this._displayInfoName(eltInfoName)
            thisButtonId.innerText = buttonPressId
        }

        if (buttonPressId == "btnRefresh") {
            btnRefresh.style.color = "white"
            btnRefresh.style.backgroundColor = "darkgreen"

        } else if (buttonPressId == "btnDebug") {
            btnDebug.style.color = "white"
            btnDebug.style.backgroundColor = "darkred"
            this._hass.callService("device_tracker", "icloud3_update", {
                command: 'log_level eventlog'})

        } else if (buttonPressId == "btnRestart") {
            btnRestart.style.color = "white"
            btnRestart.style.backgroundColor = "darkred"
            this._displayTimeName("iCloud3 Restarting")
            this._hass.callService("device_tracker", "icloud3_update", {
                command: 'restart'})

         } else {
            lastButtonPressed.style.color = "#0088F0"
            lastButtonPressed.style.backgroundColor = "transparent"
            thisButtonPressed.style.color = "white"
            thisButtonPressed.style.backgroundColor = "#0088F0"
        }

        this._hass.callService("device_tracker", "icloud3_update", {
            device_name: devicenames[buttonPressX],
            command: 'refresh_event_log'})
    }
//---------------------------------------------------------------------------
    _clearbtnRefresh() {
        const root = this.shadowRoot;
        const btnRefresh = root.getElementById('btnRefresh')
        btnRefresh.style.color = "darkgreen"
        btnRefresh.style.backgroundColor = "transparent"
    }
//---------------------------------------------------------------------------
    _clearbtnDebug() {
        const root = this.shadowRoot;
        const btnDebug = root.getElementById('btnDebug')
        btnDebug.style.color = "darkred"
        btnDebug.style.backgroundColor = "transparent"
    }
//---------------------------------------------------------------------------
    _clearbtnRestart() {
        const root = this.shadowRoot;
        const btnRestart = root.getElementById('btnRestart')
        btnRestart.style.color = "darkred"
        btnRestart.style.backgroundColor = "transparent"
    }
//---------------------------------------------------------------------------
    _btnClassMouseOver(buttonId) {
        const root   = this.shadowRoot;
        const button = root.getElementById(buttonId)
        const btnDebug      = root.getElementById('btnDebug')
        const btnRestart    = root.getElementById('btnRestart')
        const hass          = this._hass;
        const logLevelDebug = hass.states['sensor.icloud3_event_log'].attributes['log_level_debug']
        //const logLevelDebug = this.logLevelDebug
        const thisButtonId = root.getElementById("thisButtonId")

        if (buttonId == "btnRefresh") {
            button.style.backgroundColor = "#c6ecd7"
            this._displayTimeName("Refresh Event Log")

        } else if (buttonId == "btnDebug") {
            btnDebug.style.color = "darkred"
            button.style.backgroundColor = "#f9ebeb"
            if (logLevelDebug == 'On') {
                this._displayTimeName("Turn off debug logging")
            } else {
                this._displayTimeName("Turn on debug logging")
            }

        } else if (buttonId == "btnRestart") {
            btnRestart.style.color = "darkred"
            button.style.backgroundColor = "#f9ebeb"
            this._displayTimeName("Restart iCloud3")

        } else if (buttonId !== thisButtonId.innerText) {
            button.style.backgroundColor = "#d8ecf3"
        }
    }
//---------------------------------------------------------------------------
    _btnClassMouseOut(buttonId) {
        const root = this.shadowRoot;
        const hass          = this._hass;
        this.logLevelDebug  = hass.states['sensor.icloud3_event_log'].attributes['log_level_debug']
        const logLevelDebug = this.logLevelDebug
        const eltInfoUpdateTime = root.getElementById("eltInfoUpdateTime")
        const button        = root.getElementById(buttonId)
        const btnRefresh    = root.getElementById('btnRefresh')
        const btnDebug      = root.getElementById('btnDebug')
        const btnRestart      = root.getElementById('btnRestart')
        const thisButtonId  = root.getElementById("thisButtonId")

        btnRefresh.style.color = "darkgreen"
        btnRefresh.style.backgroundColor = "transparent"

        if (buttonId == "btnDebug") {
            var updateTimeAttr = hass.states['sensor.icloud3_event_log'].attributes['update_time']

            if (logLevelDebug == 'On') {
                btnDebug.style.color = "white"
                btnDebug.style.backgroundColor = "darkred"
                this._displayTimeName("Debug Logging On ... "+updateTimeAttr)
                //this._displayTimeName(updateTimeAttr)
            } else {
                btnDebug.style.color = "darkred"
                btnDebug.style.backgroundColor = "transparent"
                this._displayTimeName("")
            }

        } else if (buttonId == "btnRestart") {
            if (eltInfoUpdateTime.innerText != "iCloud3 Restarting") {
                btnRestart.style.color = "darkred"
                btnRestart.style.backgroundColor = "transparent"
                this._displayTimeName("")
            }

        } else {
            if (buttonId !== thisButtonId.innerText) {
                button.style.backgroundColor = "transparent"
                this._displayTimeName("")
            }
        }
    }
//---------------------------------------------------------------------------
    _currentButtonId() {
        const root = this.shadowRoot;
        const thisButtonId = root.getElementById("thisButtonId")

        return thisButtonId.innerText
    }
//---------------------------------------------------------------------------
    _displayTimeName(msg) {
        // Display  message before time field

        const root = this.shadowRoot;
        const hass = this._hass;
        const eltInfoUpdateTime = root.getElementById("eltInfoUpdateTime")
        var updateTimeAttr      = hass.states['sensor.icloud3_event_log'].attributes['update_time']

        if (msg == "") {
            eltInfoUpdateTime.innerText = updateTimeAttr
            eltInfoUpdateTime.style.color = "darkred"
        } else {
            eltInfoUpdateTime.innerText = msg
            eltInfoUpdateTime.style.color = "blue"
        }

        //alert("iC3 Message-"+msg);
    }

//---------------------------------------------------------------------------
    _displayInfoName(msg) {
        /* Display test messages
        */
        const root = this.shadowRoot;
        root.getElementById("eltInfoName").innerText = msg

        //alert("Hello World!"+buttonX);
    }

//---------------------------------------------------------------------------
     getCardSize() {
        return 1;
    }
}

customElements.define('icloud3-event-log-card', iCloud3EventLogCard);
