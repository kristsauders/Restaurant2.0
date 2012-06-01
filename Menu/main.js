// I used YUI 3, so you can google their documentation to find other capabilites, otherwise I'll just do it afterwards.
YUI().use("io-base", "cache-offline", "node", "transition", "node-load", "get", "gallery-dispatcher", function(Y) {
    
    function onLoad(id, o) {
        var data = o.responseText; // Response data.
        Y.one('body').append('<div style="visibility:hidden;position:absolute;top:120px;left:0px;'
                                +'width:100%;height:80%;" id="' + uri + '">' + data);
        Y.one('body').append('</div>');
    };
    
    Y.on('io:complete', onLoad, Y);
    
    var uri = "specials-royale.html";
    var request = Y.io(uri, {sync:true});
    var uri = "specials.html";
    var request = Y.io(uri, {sync:true});
    var uri = "bigmac-details.html";
    var request = Y.io(uri, {sync:true});
    var uri = "desserts.html";
    var request = Y.io(uri, {sync:true});
    var uri = "drinks.html";
    var request = Y.io(uri, {sync:true});
    var uri = "food.html";
    var request = Y.io(uri, {sync:true});
    var uri = "fries-details.html";
    var request = Y.io(uri, {sync:true});
    var uri = "not-supported.html";
    var request = Y.io(uri, {sync:true});
    var uri = "onourway.html";
    var request = Y.io(uri, {sync:true});
    var uri = "other.html";
    var request = Y.io(uri, {sync:true});
    var uri = "popular.html";
    var request = Y.io(uri, {sync:true});
    var uri = "popup.html";
    var request = Y.io(uri, {sync:true});
    var uri = "remembered.html";
    var request = Y.io(uri, {sync:true});
    var uri = "royale-details.html";
    var request = Y.io(uri, {sync:true});

    var uri = "specials-sundae.html";
    var request = Y.io(uri, {sync:true});
    var uri = "specials-turkey.html";
    var request = Y.io(uri, {sync:true});
        
    // Set up cache for saving variables
    var cache = new Y.CacheOffline({
        sandbox:"6-hr-cache", // Pass in a unique identifier
        uniqueKeys: true,
        expires:21600000 // Expire data after 6 hours
    });
    
    // Clear cache during development only
    cache.flush();
    
    // Check if Remembered button should be lit up, by checking for key in cache
    if(cache.retrieve("RememberedButtonLitUp")) {
        if(cache.retrieve("RememberedButtonLitUp").response==true) {
            // Light up remembered button
            var remembered = Y.one('#remembered');
            remembered.setAttribute("class", "button lit-up");
        }
    }
    
    // Check if Call button should be lit up, by checking for key in cache
    if(cache.retrieve("CallButtonLitUp")) {
        if(cache.retrieve("CallButtonLitUp").response==true) {
            // Light up Call button
            var call = document.getElementsByName("onourway.html")[0];
            call.setAttribute("class", "button lit-up");
        }
    }
    
    // Check what page is loaded in main content div, by checking for key in cache, and then load that page
    if(cache.retrieve("CurrentlyLoadedPage")) {
        document.getElementById(cache.retrieve("CurrentlyLoadedPage").response).style.visibility = 'visible';
        if(cache.retrieve("CurrentlyLoadedPage").response.split("details").length==1) {
            Y.all('#back').hide();
        } else {
            Y.all('#menu-bar').hide();
        }
    } else {
        // If it has not been set, then set to default
        cache.add("CurrentlyLoadedPage", "specials-royale.html");
        //Y.one('#content').load(cache.retrieve("CurrentlyLoadedPage").response);
        document.getElementById(cache.retrieve("CurrentlyLoadedPage").response).style.visibility = 'visible';
        Y.all('#back').hide();
    }
    
    // Set default LastLoadedPage to default specials page
    if(!cache.retrieve("LastLoadedPage")) {
        cache.add("LastLoadedPage", "specials-royale.html");
    }

    // This is how you add entries to the Cache
    cache.add("key1", "value1");
    cache.add("key2", "value2");

    // This is how you retrieve a cached entry
    cache.retrieve("key1");

    // Flush the cache
    Y.all('#clear-cache').on('click', function (e) {
        cache.flush();
        alert("Cache cleared");
    });
    
    // Hide something
    Y.all('#hide-me').on('click', function (e) {
        e.currentTarget.hide();
    });
    
    // Add content before or after a clicked div
    Y.all('#modifyable').on('click', function(e) {
        var node = e.currentTarget;
        node.prepend('<em>prepended</em> &nbsp;'); // added as firstChild
        node.append('&nbsp; <em>appended</em>');  // added as lastChild
    });
    
    // Get the cached remembered items
    Y.all('#get-cache').on('click', function () {
        alert(cache.retrieve("RememberedItems").response);
    });
    
    // Hide Menu bar
    Y.all('#hide-menu-bar').on('click', function (e) {
        Y.all('#menu-bar').hide();
    });
    
    // Show Menu bar
    Y.all('#show-menu-bar').on('click', function (e) {
        Y.all('#menu-bar').show();
    });
    
    // Hide Back button
    Y.all('#hide-back-button').on('click', function (e) {
        Y.all('#back').hide();
    });
    
    // Show Back button
    Y.all('#show-back-button').on('click', function (e) {
        Y.all('#back').show();
    });
    
    // Fade something away
    Y.all('#fade-me').on('click', function () {
        Y.one('#fade-me').transition({
            duration: 1, // seconds
            opacity : 0
        });
    });

    // Shrink something to nothing
    Y.all('#shrink-me').on('click', function () {
        Y.all('#shrink-me').transition({
            duration: 1, // seconds
            width   : 0,
            height  : 0
        });
    });
    
    // Load new page
    Y.all('#load-new-page').on('click', function (e) {
        var node = e.currentTarget;
        // Set cache key LastLoadedPage to last page
        cache.add("LastLoadedPage", cache.retrieve("CurrentlyLoadedPage").response);
        // Set cache key CurrentlyLoadedPage to new page
        cache.add("CurrentlyLoadedPage", node.get("name"));
        // Load page
        //Y.one('#content').load(node.get("name"), function() {});
        document.getElementById(cache.retrieve("LastLoadedPage").response).style.visibility = 'hidden';
        document.getElementById(node.get("name")).style.visibility = 'visible';
        
        // Manipulate menu and back button
        if(cache.retrieve("CurrentlyLoadedPage").response.split("details").length>1) {
            Y.all('#menu-bar').hide();
            Y.all('#back').show();
        }
        if(cache.retrieve("CurrentlyLoadedPage").response.split("details").length==1) {
            Y.all('#back').hide();
            Y.all('#menu-bar').show();
        }
        
        if(node.getAttribute("class")=="menu-item") {
            Y.all('#load-new-page').each(function(node) {
                node.removeClass("lit-up");
            });
            node.setAttribute("class", "menu-item lit-up");
        }
    });
    
    // Load last page (Back)
    Y.all('#back').on('click', function (e) {
        //Y.one('#content').load(cache.retrieve("LastLoadedPage").response);
        document.getElementById(cache.retrieve("CurrentlyLoadedPage").response).style.visibility = 'hidden';
        document.getElementById(cache.retrieve("LastLoadedPage").response).style.visibility = 'visible';
        cache.add("CurrentlyLoadedPage", cache.retrieve("LastLoadedPage").response);
        cache.add("LastLoadedPage", "specials-royale.html");
        
        // Manipulate menu and back button
        if(cache.retrieve("CurrentlyLoadedPage").response.split("details").length>1) {
            Y.all('#menu-bar').hide();
            Y.all('#back').show();
        }
        if(cache.retrieve("CurrentlyLoadedPage").response.split("details").length==1) {
            Y.all('#back').hide();
            Y.all('#menu-bar').show();
        }
    });
    
    // Close popup
    function closePopup() {
        Y.all('#popup').setStyle('visibility', 'hidden');
        Y.all('#overlay').setStyle('visibility', 'hidden');
        Y.all('#close-popup').setStyle('visibility', 'hidden');
    }
    
    // Load new popup
    Y.all('#load-new-popup').on('click', function (e) {
        Y.one('#popup').load(e.currentTarget.get("name"), function() {
            Y.one('#popup').setStyle('visibility', 'visible');
            Y.one('#overlay').setStyle('visibility', 'visible');
            Y.one('#close-popup').setStyle('visibility', 'visible');
            document.getElementById('close-popup').onclick = closePopup;
            // If loading the Call Waiter popup, then light up the Call button and 
            // save that to the cache, so it stays lit.
            if((e.currentTarget.get("name")=="onourway.html") || (e.currentTarget.get("name")=="onourway2.html")) {
                var oow = document.getElementsByName('onourway.html')[0];
                oow.setAttribute("class", "button lit-up");
                cache.add("CallButtonLitUp", true);
            }
        });
    });
    
    // Load Remembered list
    Y.all('#remembered').on('click', function (e) {
        //Y.one('#content').load('remembered.html');
        document.getElementById(cache.retrieve("CurrentlyLoadedPage").response).style.visibility = 'hidden';
        document.getElementById(e.currentTarget.get("name")).style.visibility = 'visible';
        cache.add("LastLoadedPage", cache.retrieve("CurrentlyLoadedPage").response);
        cache.add("CurrentlyLoadedPage", "remembered.html");
    });
    
    // Example of clicking a Remember button, which lights up the 
    // remembered button in the corner and adds the item's name to the RememberedItems key in the cache
    Y.all('#remember').on('click', function(e) {
        // Light up remembered button
        var remembered = Y.one('#remembered');
        remembered.setAttribute("class", "button lit-up");
        e.currentTarget.setAttribute("class", "button lit-up");
        
        // Add key in cache that Remembered button is now lit up
        cache.add("RememberedButtonLitUp", true);
        
        // Add this item to the cache, under key RememberedItems, it looks for a name attribute in the div clicked
        var node = e.currentTarget;
        var RememberedItems = cache.retrieve("RememberedItems");
        if(RememberedItems==null) {
            RememberedItems = node.get("name");
            cache.add("RememberedItems", RememberedItems);
        } else {
            RememberedItems = RememberedItems.response;
            if(RememberedItems.split(node.get("name")).length==1) RememberedItems = RememberedItems + "," + node.get("name");
            cache.add("RememberedItems", RememberedItems);
        }
        
    });
});