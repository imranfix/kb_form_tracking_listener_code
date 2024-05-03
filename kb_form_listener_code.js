<script>
(function() {
    
    function parseQueryStringToObject(queryString) {
        var params = new URLSearchParams(queryString);
        var parsedObject = {};
        params.forEach(function(value, key) {
            parsedObject[key] = value;
        });
        return parsedObject;
    }

    var origXMLHttpRequest = XMLHttpRequest;
    XMLHttpRequest = function() {
        var requestURL;
        var requestMethod;
        var requestBody;

        var xhr = new origXMLHttpRequest();
        var origOpen = xhr.open;
        var origSend = xhr.send;

        // Override the open function.
        xhr.open = function(method, url) {
            requestURL = url;
            requestMethod = method;
            return origOpen.apply(this, arguments);
        };

        xhr.send = function(data) {
            // Only proceed if the request URL matches what we're looking for.
            if (/.+\/admin-ajax\.php/.test(requestURL)) {
                xhr.addEventListener('load', function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var response = JSON.parse(xhr.responseText);

                            if (response.success && data.includes('action=kb_process_ajax_submit')) {

                                var requestBody = parseQueryStringToObject(data);

                                if(requestBody.action === "kb_process_ajax_submit") {
                                    window.dataLayer = window.dataLayer || [];
                                    dataLayer.push({
                                        event: 'kb_form_submit', 
                                        form_id: requestBody['_kb_form_id'],
                                        inputs: requestBody
                                    });
                                }
                            }
                        }
                    }
                });
            }

            return origSend.apply(this, arguments);
        };

        return xhr;
    };
})();
</script>


