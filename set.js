// import firebase from '/plugins/firebase.js'

// const database = firebase.database();
// const room = "dataroom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, set, get, child, onChildAdded, remove, onChildRemoved }
    from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {

};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db, "datasave"); //RealtimeDB内の"chat"を使う
const dbRef02 = ref(db, "chat02"); //RealtimeDB内の"chat"を使う


var list_title = []
var list_data = []

// saveを押した時のクリックイベント htmlデータを格納
$("#item_save").on("click", function () {
    const datasave = {
        title: $("#data_title").val(),
        data: $(".outer_wrap").html()
    }
    const newDatasave = push(dbRef)
    set(newDatasave, datasave);
    alert("saveされました")
});

// ページを更新する
$("#restart").on("click", function () {
    location.reload();

}); 

// firebaseからのデータの取得
$("#item_load").on("click", function () {



    // Realtimedatabaseからデータを取得、読取ファイルのselect optionを生成する
    get(child(ref(getDatabase(app)), "datasave")).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            // 配列として取り出す
            const dataArray = Array.isArray(data) ? data : Object.values(data);
            // console.log("配列としてのデータ:", dataArray);
            //    listの初期化
            list_title = []
            list_data = []
            // 取得したデータを配列として取得する[title]と[data]でそれぞれ配列を作成
            dataArray.forEach(function (t) {
                list_title.push(t["title"])
                list_data.push(t["data"])
            });
            //select optionの初期化
            $("#select_title").html("");
            //select optionにtitleを追加する
            list_title.forEach(function (element) {
                const title_display = element
                const add_select = `
                <option value="${title_display}">${title_display}</option>
                `;
                $("#select_title").append(add_select);

            });
        } else {
            console.log("データが見つかりませんでした。");
        }
    }).catch((error) => {
        console.error("データ取得中にエラーが発生しました：", error);
    });


});

// 選択したtitleに対応するdataを取得する
$("#data_load").on("click", function () {
    let result = confirm("黒板を上書きしますか？saveしていない黒板は消去されます。")
    if (result) {
        //select optionの初期化
        $(".outer_wrap").empty();
        const title_select = $("#select_title").val();
        const title_array_index = list_title.indexOf(title_select)
        $(".outer_wrap").append(list_data[title_array_index]);    
        alert("黒板をloadしました")
    }
    

});


var drag_id = null
// dragitemoの制御
$(function () {
    // dragitmeの設定
    $('.dragitem').draggable({
        revert: true,
        stack: ".drop_area",

        start: function () {
            drag_id = $(this).attr('id');
            console.log(drag_id);

        }
    });
    // dropエリアの設定
    $('.drop_area').droppable({
        drop: function () {
            if (drag_id == "drag01") {
                var flow = `
            <textarea class="inner_content_text02 change_button" style=outline:"none" type="text">テキストを入力</textarea>
            <img cllass="" src="img/flow04.png" alt="">
            
            `;
            }
            else if (drag_id == "drag02") {
                var flow = `
      <textarea class="inner_content_text" type="text"></textarea>
            `;
            }
            else if (drag_id == "drag03") {
                var flow = `
     <textarea class="inner_content_text03 change_button" style=outline:"none" type="text">テキストを入力</textarea>
            <img cllass="" src="img/flow_down.png" alt="">
            `;
            }
            else if (drag_id == "drag04") {
                var flow = `
            <img cllass="img_pic" id="pic_img"src="img/human01.png" alt="">
            `;
            }

            $(this)
                .html(flow);
        }
    });
});



// gridのブロック数を反映させる
$("#grid_setting").on("click", function () {
    var grid_row = $("#grid_row").val();
    var grid_column = $("#grid_column").val();
    console.log("grid_column/grid_row", grid_column, grid_row);
    $(".outer_wrap").css(
        "grid-template-columns", `50px repeat(${grid_column}, 300px)`);
    $(".outer_wrap").css(
        "grid-template-rows", `50px repeat(${grid_row}, 300px)`);


});


// $(document).ready(function () {
//     // 初期値を設定
//     var initialText = "テキストを入力";

//     // テキストエリアを選択
//     var $textarea = $("textarea.inner_content_text03");

//     // 初期値を新しい値に置き換え
//     var newText = "新しいテキストをここに入力してください";

//     // 条件付きで初期値を置き換える
//     if ($textarea.val() === initialText) {
//         $textarea.val(newText);
//     }
// });


// //修正後の文字をenterを押したときにpタグに返して、inputを閉じる
// $(document).on("keydown", ".change_button", function (event) { //動的DOMには$(document).on
//     if (event.keyCode === 13) {
//         text_change = $(this).val();
//         console.log("text", text_change);
//         $(this).text(text_change); 
        
//             }
// });



// var counter = true
// //図形の文字を入力したときの クリックイベント
// $(".input_form").on("click", function () {
//     // 一度だけinputが出力されるように制御、入力済みのテキストを表示
//     if (counter == true) {
//         const text_current = $(this).find("p").text(); //入力済みテキストの取得
//         console.log("text_current", text_current);
//         const html = `
//     <textarea class="inner_content change_button" type="text">${text_current}</textarea>
//     `;
//         console.log(html)
//         $(this).append(html);
//         counter = false;
//     }
// });

// $(document).on("click", ".input_form", function () { //動的DOMには$(document).on
//     // 一度だけinputが出力されるように制御、入力済みのテキストを表示
//     if (counter == true) {
//         const text_current = $(this).text(); //入力済みテキストの取得
//         console.log("text_current", text_current);
//         const html = `
//     <textarea class="inner_content_text change_button" type="text">${text_current}</textarea>
//     `;
//         console.log(html)
//         $(this).append(html);
//         counter = false;
//     }

// });

// //修正後の文字をenterを押したときにpタグに返して、inputを閉じる
// $(document).on("keydown", ".change_button", function (event) { //動的DOMには$(document).on
//     if (event.keyCode === 13) {
//         text_change = $(this).val();
//         console.log("text", text_change);
//         $(this).find(p).text(text_change); //兄弟要素から"p"を取得
//         $(this).remove(); //textinputを削除
//         counter = true; // 更新クリックの解除
//     }

// });

// $(function () {
//     $('.inner_wrap').draggable();
//     // $('.inner_content').resizable();

// });
