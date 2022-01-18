import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const html = `
<form method="POST" action="/">
  <select name="move_type">
<option value=normal>ノーマル</option>
<option value=fire>ほのお</option>
<option value="water">みず</option>
<option value="electric">でんき</option>
<option value="grass">くさ</option>
<option value="ice">こおり</option>
<option value="fighting">かくとう</option>
<option value="poison">どく</option>
<option value="ground">じめん</option>
<option value="flying">ひこう</option>
<option value="psychic">エスパー</option>
<option value="bug">むし</option>
<option value="rock">いわ</option>
<option value="ghost">ゴースト</option>
<option value="dragon">ドラゴン</option>
<option value="dark">あく</option>
<option value="steel">はがね</option>
<option value="fairy">フェアリー</option>
</select>

<select name="pokemon_type1">
<option value=normal>ノーマル</option>
<option value=fire>ほのお</option>
<option value="water">みず</option>
<option value="electric">でんき</option>
<option value="grass">くさ</option>
<option value="ice">こおり</option>
<option value="fighting">かくとう</option>
<option value="poison">どく</option>
<option value="ground">じめん</option>
<option value="flying">ひこう</option>
<option value="psychic">エスパー</option>
<option value="bug">むし</option>
<option value="rock">いわ</option>
<option value="ghost">ゴースト</option>
<option value="dragon">ドラゴン</option>
<option value="dark">あく</option>
<option value="steel">はがね</option>
<option value="fairy">フェアリー</option>
</select>

<select name="pokemon_type2">
<option value="none">---</option>
<option value="normal">ノーマル</option>
<option value="fire">ほのお</option>
<option value="water">みず</option>
<option value="electric">でんき</option>
<option value="grass">くさ</option>
<option value="ice">こおり</option>
<option value="fighting">かくとう</option>
<option value="poison">どく</option>
<option value="ground">じめん</option>
<option value="flying">ひこう</option>
<option value="psychic">エスパー</option>
<option value="bug">むし</option>
<option value="rock">いわ</option>
<option value="ghost">ゴースト</option>
<option value="dragon">ドラゴン</option>
<option value="dark">あく</option>
<option value="steel">はがね</option>
<option value="fairy">フェアリー</option>
</select>
  <button type="submit">Submit</button>
</form>
`;

//使用する技のタイプと防御側のポケモンのタイプの相性
const compatibility  = {
    normal:{normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:1,poison:1,ground:1,
                flying:1,psychic:1,bug:1,rock:0.5,ghost:0,dragon:1,dark:1,steel:0.5,fairy:1
            },
    fire:{normal:1,fire:0.5,water:0.5,electric:1,grass:2,ice:2,fighting:1,poison:1,ground:1,
                flying:1,psychic:1,bug:2,rock:0.5,ghost:1,dragon:0.5,dark:1,steel:2,fairy:1
            },
    water:{normal:1,fire:2,water:0.5,electric:1,grass:0.5,ice:1,fighting:1,poison:1,ground:2,
                flying:1,psychic:1,bug:1,rock:2,ghost:1,dragon:0.5,dark:1,steel:1,fairy:1
            },
    electric:{normal:1,fire:1,water:2,electric:0.5,grass:0.5,ice:1,fighting:1,poison:1,ground:0,
            flying:2,psychic:1,bug:1,rock:1,ghost:1,dragon:0.5,dark:1,steel:1,fairy:1
           },
    grass:{normal:1,fire:0.5,water:2,electric:1,grass:0.5,ice:1,fighting:1,poison:0.5,ground:2,
            flying:0.5,psychic:1,bug:0.5,rock:2,ghost:1,dragon:0.5,dark:1,steel:0.5,fairy:1
            },
    ice:{normal:1,fire:0.5,water:0.5,electric:1,grass:2,ice:0.5,fighting:1,poison:1,ground:2,
                flying:2,psychic:1,bug:1,rock:1,ghost:1,dragon:2,dark:1,steel:0.5,fairy:1
            },
    fighting:{normal:2,fire:1,water:1,electric:1,grass:1,ice:2,fighting:1,poison:0.5,ground:1,
                flying:0.5,psychic:0.5,bug:0.5,rock:2,ghost:0,dragon:1,dark:2,steel:2,fairy:0.5
            },
    poison:{normal:1,fire:1,water:1,electric:1,grass:2,ice:1,fighting:1,poison:0.5,ground:0.5,
                flying:1,psychic:1,bug:1,rock:0.5,ghost:0.5,dragon:1,dark:1,steel:0,fairy:2
            },
    ground:{normal:1,fire:2,water:1,electric:2,grass:0.5,ice:1,fighting:1,poison:2,ground:1,
                flying:0,psychic:1,bug:0.5,rock:2,ghost:1,dragon:1,dark:1,steel:2,fairy:1
            },
    flying:{normal:1,fire:1,water:1,electric:0.5,grass:2,ice:1,fighting:2,poison:1,ground:1,
                flying:1,psychic:1,bug:2,rock:0.5,ghost:1,dragon:1,dark:1,steel:0.5,fairy:1
            },
    psychic:{normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:2,poison:2,ground:1,
                flying:1,psychic:0.5,bug:1,rock:1,ghost:1,dragon:1,dark:0,steel:0.5,fairy:1
            },
    bug:{normal:1,fire:0.5,water:1,electric:1,grass:2,ice:1,fighting:0.5,poison:0.5,ground:1,
                flying:0.5,psychic:2,bug:1,rock:1,ghost:0.5,dragon:1,dark:2,steel:0.5,fairy:0.5
            },
    rock:{normal:1,fire:2,water:1,electric:1,grass:1,ice:2,fighting:0.5,poison:1,ground:0.5,
                flying:2,psychic:1,bug:2,rock:1,ghost:1,dragon:1,dark:1,steel:0.5,fairy:1
            },
    ghost:{normal:0,fire:1,water:1,electric:1,grass:1,ice:1,fighting:1,poison:1,ground:1,
                flying:1,psychic:2,bug:1,rock:1,ghost:2,dragon:1,dark:0.5,steel:1,fairy:1
            },
    dragon:{normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:1,poison:1,ground:1,
                flying:1,psychic:1,bug:1,rock:1,ghost:1,dragon:2,dark:1,steel:0.5,fairy:0
            },
    dark:{normal:1,fire:1,water:1,electric:1,grass:1,ice:1,fighting:0.5,poison:1,ground:1,
                flying:1,psychic:2,bug:1,rock:1,ghost:2,dragon:1,dark:0.5,steel:1,fairy:0.5
            },
    steel:{normal:1,fire:0.5,water:0.5,electric:0.5,grass:1,ice:2,fighting:1,poison:1,ground:1,
                flying:1,psychic:1,bug:1,rock:2,ghost:1,dragon:1,dark:1,steel:0.5,fairy:1
            },
    fairy:{normal:1,fire:0.5,water:1,electric:1,grass:1,ice:1,fighting:2,poison:0.5,ground:1,
                flying:1,psychic:1,bug:1,rock:1,ghost:1,dragon:2,dark:2,steel:0.5,fairy:1
            }
};



function damageMagnification(move_type,pokemon_type1,pokemon_type2) {
    var magnification = compatibility[move_type][pokemon_type1];
    if (pokemon_type2 != "none") {
        magnification *= compatibility[move_type][pokemon_type2];
    }
    var msg;
    if (magnification == 1) {
        msg = "通常の効果";
    }
    else if (magnification == 0) {
        msg = "効果がない";
    }
    else if (magnification > 1) {
        msg = "効果はばつぐん";
    }
    else if (magnification < 1 && magnification > 0) {
        msg = "効果はいまひとつ";
    }
    return [magnification,msg];
}

function assertDamage(input,expected) {
    var actual = damageMagnification(input[0],input[1],input[2]);
    if (actual[0] != expected[0] || actual[1] != expected[1]) {
        console.log(`\x1b[31m${input} => ${expected} expected, but got ${actual}\x1b[0m`);
        Deno.exit(1);
    }
}

function unitTest() {
    assertDamage(["fire","grass","none"],[2,"効果はばつぐん"]);
    assertDamage(["fire","grass","ice"],[4,"効果はばつぐん"]);
    assertDamage(["normal","ghost","none"],[0,"効果がない"]);
    assertDamage(["normal","ghost","fire"],[0,"効果がない"]);
    assertDamage(["normal","normal","flying"],[1,"通常の効果"]);
    assertDamage(["electric","water","flying"],[4,"効果はばつぐん"]);
    assertDamage(["ice","grass","ice"],[1,"通常の効果"]);
    assertDamage(["fighting","ghost","dark"],[0,"効果がない"]);
    assertDamage(["fire","water","none"],[0.5,"効果はいまひとつ"]);
    assertDamage(["fire","water","electric"],[0.5,"効果はいまひとつ"]);
    assertDamage(["fire","fire","rock"],[0.25,"効果はいまひとつ"]);
    assertDamage(["dragon","dragon","none"],[2,"効果はばつぐん"]);
    assertDamage(["ghost","ghost","none"],[2,"効果はばつぐん"]);
    assertDamage(["ghost","ghost","dark"],[1,"通常の効果"]);
}

unitTest();

async function handler(req) {
    switch (req.method) {
        case "GET": {
            return new Response(html, {
                headers: { "content-type": "text/html; charset=utf-8" },
            });
        }

        case "POST": {
            const body = await req.formData();

            const move_type = body.get("move_type");
            const pokemon_type1 = body.get("pokemon_type1");
            const pokemon_type2 = body.get("pokemon_type2");

            var ans = damageMagnification(move_type,pokemon_type1,pokemon_type2) 

            return new Response(html+`Damage ${ans}!`, {
                headers: { "content-type": "text/html; charset=utf-8" },
            });
        }
    
        default:
            return new Response("Invalid method", { status: 405 });
    }
}

console.log("Listening on http://localhost:8000");
serve(handler);
