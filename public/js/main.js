/**
 * Created by lmislm on 2018/2/10.
 */
$(document).ready(function () {
    $('.delete-article').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');

        $.ajax({
            type: 'DELETE',
            url: '/article/'+id,
            success: function (response) {
                alert('确定删除？');
                window.location.href='/';
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
});