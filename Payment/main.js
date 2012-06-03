// I used YUI 3, so you can google their documentation to find other capabilites, otherwise I'll just do it afterwards.
YUI().use("io-base", "cache-offline", "node", "transition", "node-load", "get", "gallery-dispatcher", function(Y) {
    
    // Set up cache for saving variables
    var cache = new Y.CacheOffline({
        sandbox:"6-hr-cache", // Pass in a unique identifier
        uniqueKeys: true,
        expires:21600000 // Expire data after 6 hours
    });
    
    // Clear cache during development only
    // cache.flush();    

    Y.all('#menu-bar').hide();
    
    function onLoad(id, o) {
        var data = o.responseText; // Response data.
        Y.one('body').append('<div style="visibility:hidden;position:absolute;top:110px;left:0px;'
                                +'width:100%;height:80%;" id="' + uri + '">' + data);
        Y.one('body').append('</div>');
    };
    
    Y.on('io:complete', onLoad, Y);
    
    var uri = "thanks-for-playing.html";
    var request = Y.io(uri, {sync:true});
    var uri = "thank-you.html";
    var request = Y.io(uri, {sync:true});
    var uri = "not-supported.html";
    var request = Y.io(uri, {sync:true});
    var uri = "onourway.html";
    var request = Y.io(uri, {sync:true});
    var uri = "please-swipe.html";
    var request = Y.io(uri, {sync:true});
    var uri = "tips.html";
    var request = Y.io(uri, {sync:true});
    var uri = "popup.html";
    var request = Y.io(uri, {sync:true});
    var uri = "bill.html";
    var request = Y.io(uri, {sync:true});
    var uri = "bill-split.html";
    var request = Y.io(uri, {sync:true});
    var uri = "tips-all.html";
    var request = Y.io(uri, {sync:true});
    
    // Set currently loaded page to default
    cache.add("CurrentlyLoadedPagePayment", "bill.html");
    document.getElementById(cache.retrieve("CurrentlyLoadedPagePayment").response).style.visibility = 'visible';
    Y.all('#back').hide();
    
    // Set default LastLoadedPagePayment to default
    cache.add("LastLoadedPagePayment", "bill.html");
    
    // Load new page
    Y.all('#load-new-page').on('click', function (e) {
        var node = e.currentTarget;
        // Set cache key LastLoadedPagePayment to last page
        cache.add("LastLoadedPagePayment", cache.retrieve("CurrentlyLoadedPagePayment").response);
        // Set cache key CurrentlyLoadedPagePayment to new page
        cache.add("CurrentlyLoadedPagePayment", node.get("name"));
        // Load page
        //Y.one('#content').load(node.get("name"), function() {});
        document.getElementById(cache.retrieve("LastLoadedPagePayment").response).style.visibility = 'hidden';
        document.getElementById(node.get("name")).style.visibility = 'visible';
        
        if(node.getAttribute("class")=="menu-item") {
            Y.all('#load-new-page').each(function(node) {
                if(node.get('parentNode').get('id')=='menu-bar') {
                    node.removeClass("lit-up");
                }
            });
            node.setAttribute("class", "menu-item lit-up");
        }
        
        if(node.get("name")=="tips.html") {
            Y.all('#back').show();
        }        
    });
    
    // Load new special
    Y.all('#load-new-special').on('click', function (e) {
        var node = e.currentTarget;
        // Set cache key LastLoadedPagePayment to last page
        cache.add("LastLoadedPagePayment", cache.retrieve("CurrentlyLoadedPagePayment").response);
        // Set cache key CurrentlyLoadedPagePayment to new page
        cache.add("CurrentlyLoadedPagePayment", node.get("name"));
        // Load page
        //Y.one('#content').load(node.get("name"), function() {});
        document.getElementById(cache.retrieve("LastLoadedPagePayment").response).style.visibility = 'hidden';
        document.getElementById(node.get("name")).style.visibility = 'visible';
        
        //Change Specials button to come back to this specific special
        Y.all('#load-new-page').each(function(node) {
                if(node.get('parentNode').get('id')=='menu-bar') {
                    if(node.get("name").split("specials").length==1) {
                        node.removeClass("lit-up");
                    }
                    if(node.get("name").split("specials").length>1) {
                        node.setAttribute("name", e.currentTarget.get("name"));
                    }
                }
            });
        
        // Manipulate menu and back button
        if(cache.retrieve("CurrentlyLoadedPagePayment").response.split("details").length>1) {
            Y.all('#menu-bar').hide();
            Y.all('#back').show();
        }
        if(cache.retrieve("CurrentlyLoadedPagePayment").response.split("details").length==1) {
            Y.all('#back').hide();
            Y.all('#menu-bar').show();
        }
        
        // Light up clicked menu button, take dim the others
        if(node.getAttribute("class")=="menu-item") {
            Y.all('#load-new-page').each(function(node) {
                node.removeClass("lit-up");
            });
            node.setAttribute("class", "menu-item lit-up");
        }
    });
    
    // Load last page (Back)
    Y.all('#back').on('click', function (e) {
        //Y.one('#content').load(cache.retrieve("LastLoadedPagePayment").response);
        document.getElementById(cache.retrieve("CurrentlyLoadedPagePayment").response).style.visibility = 'hidden';
        document.getElementById(cache.retrieve("LastLoadedPagePayment").response).style.visibility = 'visible';
        cache.add("CurrentlyLoadedPagePayment", cache.retrieve("LastLoadedPagePayment").response);
        cache.add("LastLoadedPagePayment", "specials-royale.html");
        
        Y.all('#back').hide();
        
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
            // Timer to close swipe popup
            if(e.currentTarget.get("name")=="please-swipe.html") {
            setTimeout(function() {
                cache.add("LastLoadedPagePayment", cache.retrieve("CurrentlyLoadedPagePayment").response);
                // Set cache key CurrentlyLoadedPagePayment to new page
                cache.add("CurrentlyLoadedPagePayment", "thank-you.html");
                document.getElementById(cache.retrieve("LastLoadedPagePayment").response).style.visibility = 'hidden';
                document.getElementById("thank-you.html").style.visibility = 'visible';
                closePopup();
            }, 5000);
        }
        });
    });
    
    // Checkbox clicks
    Y.all('#checkbox').on('click', function (e) {
        var node = e.currentTarget;
        if(node.get('checked')) {
            Y.all('#selected-total').setHTML(parseInt(Y.all('#selected-total').get('innerHTML')) + 10);
            Y.all('#subtotal').setHTML(parseInt(Y.all('#selected-total').get('innerHTML')));
            var tip = (parseInt(Y.all('#subtotal').get('innerHTML'))*parseInt(Y.all('#tip-percent').get('innerHTML')))/100;
            var total = tip + parseInt(Y.all('#subtotal').get('innerHTML'));
            Y.all('#tip').setHTML(tip.toFixed(2));
            Y.all('#total').setHTML(total.toFixed(2));
        }
        if(!node.get('checked')) {
            Y.all('#selected-total').setHTML(parseInt(Y.all('#selected-total').get('innerHTML')) - 10);
            Y.all('#subtotal').setHTML(parseInt(Y.all('#selected-total').get('innerHTML')));
            var tip = (parseInt(Y.all('#subtotal').get('innerHTML'))*parseInt(Y.all('#tip-percent').get('innerHTML')))/100;
            var total = tip + parseInt(Y.all('#subtotal').get('innerHTML'));
            Y.all('#tip').setHTML(tip.toFixed(2));
            Y.all('#total').setHTML(total.toFixed(2));
        }
    });
    
    // Plus button
    Y.all('#plus').on('click', function (e) {
        var node = e.currentTarget;
        Y.all('#tip-percent').setHTML(parseInt(Y.all('#tip-percent').get('innerHTML')) + 1);
        var tip = (parseInt(Y.all('#subtotal').get('innerHTML'))*parseInt(Y.all('#tip-percent').get('innerHTML')))/100;
        var total = tip + parseInt(Y.all('#subtotal').get('innerHTML'));
        Y.all('#tip').setHTML(tip.toFixed(2));
        Y.all('#total').setHTML(total.toFixed(2));
    });
    
    // Minus button
    Y.all('#minus').on('click', function (e) {
        var node = e.currentTarget;
        Y.all('#tip-percent').setHTML(parseInt(Y.all('#tip-percent').get('innerHTML')) - 1);
        var tip = (parseInt(Y.all('#subtotal').get('innerHTML'))*parseInt(Y.all('#tip-percent').get('innerHTML')))/100;
        var total = tip + parseInt(Y.all('#subtotal').get('innerHTML'));
        Y.all('#tip').setHTML(tip.toFixed(2));
        Y.all('#total').setHTML(total.toFixed(2));
    });
    
    // Plus button on pay all
    Y.all('#plus-all').on('click', function (e) {
        var node = e.currentTarget;
        Y.all('#tip-percent-all').setHTML(parseInt(Y.all('#tip-percent-all').get('innerHTML')) + 1);
        var tip = (parseInt(Y.all('#subtotal-all').get('innerHTML'))*parseInt(Y.all('#tip-percent-all').get('innerHTML')))/100;
        var total = tip + parseInt(Y.all('#subtotal-all').get('innerHTML'));
        Y.all('#tip-all').setHTML(tip.toFixed(2));
        Y.all('#total-all').setHTML(total.toFixed(2));
    });
    
    // Minus button on pay all
    Y.all('#minus-all').on('click', function (e) {
        var node = e.currentTarget;
        Y.all('#tip-percent-all').setHTML(parseInt(Y.all('#tip-percent-all').get('innerHTML')) - 1);
        var tip = (parseInt(Y.all('#subtotal-all').get('innerHTML'))*parseInt(Y.all('#tip-percent-all').get('innerHTML')))/100;
        var total = tip + parseInt(Y.all('#subtotal-all').get('innerHTML'));
        Y.all('#tip-all').setHTML(tip.toFixed(2));
        Y.all('#total-all').setHTML(total.toFixed(2));
    });
    
    // Load Remembered list
    Y.all('#remembered').on('click', function (e) {
        //Y.one('#content').load('remembered.html');
        Y.all('#menu-bar').show();
        Y.all('#back').hide();
        document.getElementById(cache.retrieve("CurrentlyLoadedPagePayment").response).style.visibility = 'hidden';
        document.getElementById(e.currentTarget.get("name")).style.visibility = 'visible';
        cache.add("LastLoadedPagePayment", cache.retrieve("CurrentlyLoadedPagePayment").response);
        cache.add("CurrentlyLoadedPagePayment", "remembered.html");
        var ri = cache.retrieve("RememberedItems");
        if(ri==null)
            ri = '';
        else
            ri = cache.retrieve("RememberedItems").response;
        if(ri.split('bigmac').length==1)
            Y.all('#bigmac-remembered').hide();
        else
            Y.all('#bigmac-remembered').show();
        if(ri.split('royale').length==1)
            Y.all('#royale-remembered').hide();
        else
            Y.all('#royale-remembered').show();
        if(ri.split('fries').length==1)
            Y.all('#fries-remembered').hide();
        else
            Y.all('#fries-remembered').show();
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
    // Forget item
    Y.all('#forget').on('click', function(e) {
        var node = e.currentTarget;
        var RememberedItems = cache.retrieve("RememberedItems");
        if(RememberedItems!=null) {
            RememberedItems = RememberedItems.response;
            if(RememberedItems.split(node.get("name")).length>1) {
                RememberedItems = RememberedItems.replace(node.get("name"), '').replace(',,', ',');
                cache.add("RememberedItems", RememberedItems);
            }
        }
        Y.all('#remember').each(function(n) {
            if(n.get("name")==node.get("name")) {
                n.setAttribute("class", "button");
            }
        });
        if(RememberedItems.length<4)
            Y.all('#remembered').setAttribute("class", "button");
        var ri = cache.retrieve("RememberedItems");
        if(ri==null)
            ri = '';
        else
            ri = cache.retrieve("RememberedItems").response;
        if(ri.split('bigmac').length==1)
            Y.all('#bigmac-remembered').hide();
        else
            Y.all('#bigmac-remembered').show();
        if(ri.split('royale').length==1)
            Y.all('#royale-remembered').hide();
        else
            Y.all('#royale-remembered').show();
        if(ri.split('fries').length==1)
            Y.all('#fries-remembered').hide();
        else
            Y.all('#fries-remembered').show();
    });
});