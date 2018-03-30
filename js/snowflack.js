    /**
     * @desc 随机数字生成，给定最大值和最小值，生成范围内随机整数
     */
    function randomInteger(low, high) {
        return low + Math.floor(Math.random() * (high - low));
    }
    /**
     * @desc 随机数字生成，给定最大值和最小值，生成范围内随机浮点数
     */
    function randomFloat(low, high) {
        return low + Math.random() * (high - low);
    }
    (function(window){
        /**
         * @desc 定义常量
         */
        //  一次循环在界面中飘落多少个元素
        var NUMBER_OF_LEAVES = 5;
        //  动画在随机范围内的时间
        var FADE_TIME_ON = 8;
        var FADE_TIME_OUT = 14;

        //  img的旋转动画时间
        var SPIN_TIME_ON = 4;
        var SPIN_TIME_OUT = 8;
        //  延时
        var delayTime = 0;
        
        /*
         * @desc 创建Snow类
         */
        function Snowflake(obj){
            try{
                if(typeof obj == "undefined" || !obj.containerId || !obj.imgSrc){
                    throw "containerId 和 imgSrc 必须要指定";
                    return;
                }
                //必传的参数，盒子的id和雪花图片的路径
                this.containerId = obj.containerId;
                this.imgSrc = obj.imgSrc;
                
                //可选的参数
                this.picNumber = obj.picNumber || NUMBER_OF_LEAVES;
                this.fadeTimeOn = obj.fadeTimeOn || FADE_TIME_ON;
                this.fadeTimeOut = obj.fadeTimeOut || FADE_TIME_OUT;
                this.spinTimeOn = obj.spinTimeOn || SPIN_TIME_ON;
                this.spinTimeOut = obj.spinTimeOut || SPIN_TIME_OUT;
                this.delayTime = obj.delayTime || delayTime;
                
                //动画选择，默认为false——>飘落动画，true——>旋转动画
                this.isRotate = obj.isRotate || false;
                
                this.imgWidth = obj.imgWidth || "16";

                this.initElement();
            }catch(err){
                throw err;
            }
        }
        /*
         * @desc 元素初始化
         */
        Snowflake.prototype.initElement = function(){
            var container = document.getElementById( this.containerId );
            for (var i = 0; i < this.picNumber; i++){
                container.appendChild(this.createALeaf());
            }
        }
        Snowflake.prototype.createALeaf = function(){
            var leafDiv = document.createElement('div');
            var image = document.createElement('img');

            image.src = this.imgSrc;
            image.style.width = this.imgWidth + "px";
            image.style.height = "auto";
            
            //飘落的div的初始位置
            leafDiv.className = "snowflake-container"
            leafDiv.style.width = this.imgWidth + "px";
            leafDiv.style.height = "auto";

            //  div盒子在水平方向上，初始为随机位置
            leafDiv.style.left = randomInteger(0, 100) + "%";

            var spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpinAndFlip';

            //给div和img设置动画
            leafDiv.style.webkitAnimationName = this.isRotate?'rotateAnimal':'fade, offsetX, dropdown';
            image.style.webkitAnimationName = spinAnimationName;
            
            //设置动画的持续时间
            var fadeAndDropDuration = randomFloat( this.fadeTimeOn, this.fadeTimeOut ) + "s";
            var spinDuration = randomFloat( this.spinTimeOn, this.spinTimeOut ) + "s";

            leafDiv.style.webkitAnimationDuration = fadeAndDropDuration;
            image.style.webkitAnimationDuration = spinDuration;
            
            //设置动画的延时时间
            if(this.delayTime>0){
                var leafDelay = randomFloat( 0, this.delayTime ) + "s";
                leafDiv.style.webkitAnimationDelay = leafDelay;
            }
            
            leafDiv.appendChild(image);
            return leafDiv;
        }
        window.Snowflake = Snowflake;
    })(window)