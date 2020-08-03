//右键模块
document.oncontextmenu = function (event) {
    
    return false;
}

//td组件
function td(){
    this.props={
        
    }
    this.data=function(){
        return {
            boom:false,//是否有雷
            state:null//状态flag/safe/maybe
        }
    };
    this.computed={
        //背景图片
        img:function(){
            var value="background-image:url(img/s.jpg)";
            if(this.state=="flag"){
                value="background-image:url(img/flag.jpg)";
            }
            else if(this.state=="maybe"){
                value="background-image:url(img/flag2.jpg)";
            }
            else if(this.state=="safe"){
                if(this.boom==true){
                    value="background-image:url(img/bomb0.jpg)";
                }
                else{
                    //调用扫雷模块
                    var z=this.$root.find(this);
                    //显示数据
                    switch(z){
                        case 0: value="background-image:url(img/0.jpg)";break;
                        case 1: value="background-image:url(img/1.jpg)";break;
                        case 2: value="background-image:url(img/2.jpg)";break;
                        case 3: value="background-image:url(img/3.jpg)";break;
                        case 4: value="background-image:url(img/4.jpg)";break;
                        case 5: value="background-image:url(img/5.jpg)";break;
                        case 6: value="background-image:url(img/6.jpg)";break;
                        case 7: value="background-image:url(img/7.jpg)";break;
                        case 8: value="background-image:url(img/8.jpg)";break;
                    }
                }
            }
            //返回数据
            return value;
        }
    };
    this.methods={
        //右键模块
        mouse_right:function(){
            if(this.state==null){
                this.state="flag";
            }
            else if(this.state=="flag"){
                this.state="maybe";
            }
            else if(this.state=="maybe"){
                this.state=null;
            }
        },
        //左键模块
        mouse_left:function(){
            this.state="safe";
        }
    };
    this.watch={
        //胜负模块
        state:function(val,oldval){
            if(val=="safe"){
                if(this.boom==true){
                    this.$root.$data.result="you lose!";
                    this.$root.$data.display=true;
                    if(this.$root.time==1){
                        clearInterval(q);
                    }
                }
            }
            if(oldval=="flag"){
                if(this.boom==true){
                    this.$root.$data.complete--;
                }
            }
            if(val=="flag"){
                if(this.boom==true){
                    this.$root.$data.complete++;
                }
            }
            if(this.$root.complete==this.$root.num){
                this.$root.$data.result="you win!";
                this.$root.$data.display=true;
                if(this.$root.time==1){
                    clearInterval(q);
                }
            }
        }
    };
};
var td_small=new td();
td_small.template='<span class="td cursor" @click="mouse_left" @contextmenu.prevent="mouse_right" :style="img" ><slot></slot></span>';
var td_middle=new td();
td_middle.template='<span class="td cursor" @click="mouse_left" @contextmenu.prevent="mouse_right" :style="img" v-show="this.$root.middle"><slot></slot></span>';
var td_large=new td();
td_large.template='<span class="td cursor" @click="mouse_left" @contextmenu.prevent="mouse_right" :style="img" v-show="this.$root.large"><slot></slot></span>';
Vue.component('td-small', td_small)
Vue.component('td-middle', td_middle)
Vue.component('td-large', td_large)

//根实例
var vm = new Vue({
    el:'#wrap',
    data: {
        difficulty:"初级",//难度
        middle:false,//是否中等布局
        large:false,//是否大布局
        num:0,//炸弹数量
        time:0,//剩余时间
        complete:0,//进度
        result:"点击开始按钮开始游戏!",//结果
        display:true//显示
    },
    computed:{
        
    },
    methods:{
        //单击开始按钮
        start:function(){
            //重置
            document.getElementById("timmer").innerHTML=0;
            if(this.time==1){
                clearInterval(q);
            }
            for(n=0;n<400;n++){
                Object.values(this.$refs)[n].boom=false;
                Object.values(this.$refs)[n].state=null;
                this.num=0;
                this.time=0;
                this.complete=0;
                this.display=false;
                this.result="loading...";
            }
            //初始化
            if("初级"==this.$data.difficulty){
                this.size(false,false);
                this.layout(10,10);
                this.num=10;
            }
            if("中级"==this.$data.difficulty){
                this.size(true,false);
                this.layout(15,15);
                this.num=15;
            }
            if("高级"==this.$data.difficulty){
                this.size(true,true);
                this.layout(20,20);
                this.num=20;
            }
            //计时器
            var x=0;
            q=setInterval(function(){
                x++;
                document.getElementById("timmer").innerHTML=x;
            },1000);
            this.$data.time=1;
        },
        //控制雷区大小
        size:function(middle,large){
            this.$data.middle=middle;
            this.$data.large=large;
        },
        //更改游戏难度
        choose:function(difficulty){
            this.$data.difficulty=difficulty;
        },
        //自动生成炸弹
        layout:function(num,difficulty){
            var r,c;
            var array=[];
            for(x=0;x<num;x++){
                if(x>0){
                    for(y=true;y==true;){
                        y=false;
                        r=Math.floor(Math.random()*difficulty);
                        c=Math.floor(Math.random()*difficulty);
                        array[x]=r*20+c;
                        for(z=0;z<x;z++){
                            if(array[x]==array[z]){
                                y=true;
                                break;
                            }
                        }
                    }
                }
                else{
                    r=Math.floor(Math.random()*difficulty);
                    c=Math.floor(Math.random()*difficulty);
                    array[x]=r*20+c;
                }
            }
            for(i=0;i<num;i++){
                Object.values(this.$refs)[array[i]].boom=true;
            }
        },
        //定位模块
        position:function(me){
            var num=0;
            for(x in Object.values(this.$refs)){
                num++;
                if(Object.values(this.$refs)[x]==me){
                    break;
                }
            }
            num--;
            return num;
        },
        //扫雷模块
        find:function(me){
            //调用定位模块
            var num1=this.position(me);
            //查找周围地址
            var array=[];
            if(num1==0){
                array[0]=num1+1;
                array[1]=num1+20;
                array[2]=num1+21;
            }
            else if(num1==19){
                array[0]=num1-1;
                array[1]=num1+19;
                array[2]=num1+20;
            }
            else if(num1==380){
                array[0]=num1-20;
                array[1]=num1+19;
                array[2]=num1+1;
            }
            else if(num1==399){
                array[0]=num1-20;
                array[1]=num1-21;
                array[2]=num1-1;
            }
            else if(num1%20==0){
                array[0]=num1-20;
                array[1]=num1+20;
                array[2]=num1-19;
                array[3]=num1+21;
                array[4]=num1+1;
            }
            else if((num1+1)%20==0){
                array[0]=num1-20;
                array[1]=num1+20;
                array[2]=num1-21;
                array[3]=num1+19;
                array[4]=num1-1;
            }
            else if(num1>0&&num1<19){
                array[0]=num1-1;
                array[1]=num1+1;
                array[2]=num1+19;
                array[3]=num1+21;
                array[4]=num1+20;
            }
            else if(num1>380&&num1<399){
                array[0]=num1-1;
                array[1]=num1+1;
                array[2]=num1-19;
                array[3]=num1-21;
                array[4]=num1-20;
            }
            else{
                array[0]=num1-1;
                array[1]=num1+1;
                array[2]=num1-20;
                array[3]=num1+20;
                array[4]=num1-21;
                array[5]=num1+21;
                array[6]=num1-19;
                array[7]=num1+19;
            }
            //计算周围炸弹数量
            var a=0;
            for(y in array){
                if(Object.values(this.$refs)[array[y]].boom==true){
                    a++;
                }
            }
            //单击周围区域
            if(a==0){
                for(p in array){
                    Object.values(this.$root.$refs)[array[p]].state="safe";
                }
            }
            //返回数据
            return a;
        }
    },
    watch:{

    }
})



