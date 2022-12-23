(function () {
    var links = [location.href];
    for(var i in target_list){ links.push(target_list[i]);}
    
    var visited_url = [];
    var last_time = 0;
    var current_is_visited = false;
    var min_large_time = -1;

    function checkIsLinkVisted(url, callback) {
        var i_count = 10;
        var times = [];

        function check(time) {
            var delay = parseInt(time - last_time);
            times.push(delay);
            last_time = time;
            if (i_count > 0) {
                requestAnimationFrame(check);
            } else {
                checkEnd();
            }
            i_count--;
        }

        function checkEnd() {
            var large_time_count = 0;
            var large_time = 60;

            for (var i = 0; i < times.length; i++) {
                if (times[i] > large_time) large_time_count++;
            }
            console.log(times);
            console.log(links[links.length-1]);
            if (min_large_time == -1) {
                min_large_time = large_time_count;
                if (min_large_time < 2) min_large_time = 2;
                current_is_visited = true;
                
            } else if (large_time_count >= min_large_time) {
                current_is_visited = !current_is_visited;
            }
                
            if (current_is_visited){
                visited_url.push(url);
            }
            
            if (links[0]==''){
                send_result(visited_url);
            }
            
            if (callback && typeof callback == "function") callback();
        }

        setTimeout(function () {
            requestAnimationFrame(check);
        }, 500);
    }

    function send_result(visited_url){
        $.ajax({
            type:"GET",
            url:"/get_result",
            data:{url_list:visited_url.toString()},
            dataType:"json",
        });
    }
    
    function checkByTurn(list) {
        var current = list.shift();
        if (current) {
            checkIsLinkVisted(current, function () {
                checkByTurn(list);
            });
        }
    }

    $(document).ready(function () {
        checkByTurn(links);
    });
})();
