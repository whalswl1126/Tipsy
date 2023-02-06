import Phaser from 'phaser';

import bar_wall from '../assets/map/bar_walls.png';
import bar_floor from '../assets/map/bar_floors.png';
import bar_wine from '../assets/map/bar_wineInterior.png';
import bar_furniture from '../assets/map/bar_furniture.png';
import bar_furniture_deco from '../assets/map/bar_furniture_deco.png';
import bar_deco from '../assets/map/bar_floor_wall_deco.png';
import bar_food from '../assets/map/bar_food.png';
import bar_chair from '../assets/map/bar_chairs.png';

// import face from './assets/map/face.png'
import jsonash from '../assets/character/ash.json'
import imageash from '../assets/character/ash.png'
import jsonlucy from '../assets/character/lucy.json'
import imagelucy from '../assets/character/lucy.png'

import map1 from '../assets/map/map1.json';


class PlayingScene extends Phaser.Scene {
    constructor () {
        super();
    }

    preload ()
    {
        // 플레이어 캐릭터 불러오기
        // image
        // this.load.image('character', face);
        
        // Json (키: ash or lucy)
        this.load.atlas('ash', imageash, jsonash)
        this.load.atlas('lucy', imagelucy, jsonlucy)
        // console.log(this.load.atlas('lucy', imagelucy, jsonlucy))
        // 타일맵 이미지 불러오기
        this.load.image('tilesFloor', bar_floor);
        this.load.image('tilesWall', bar_wall);
        this.load.image('tilesWine', bar_wine);
        this.load.image('tilesFurni', bar_furniture);
        this.load.image('tilesFurniDeco', bar_furniture_deco);
        this.load.image('tilesDeco', bar_deco);
        this.load.image('tilesFood', bar_food);

        // 타일맵 Json 불러오기
        this.load.tilemapTiledJSON('map', map1)
        // this.load.tilemapTiledJSON('map', map2)

        // chairObject의 의자 이미지 불러오기
        this.load.image('tilesChair', bar_chair);
        this.load.spritesheet('chairs', bar_chair, {
            frameWidth: 32,
            frameHeight: 32,
        })
    }
    
    // 생성하기
    create ()
    {
        //// 맵 생성
        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16});
        // 타일 생성
        const floorTileset = map.addTilesetImage("tilefloor",'tilesFloor');
        const wallTileset1 = map.addTilesetImage("tilewall",'tilesWall');
        const wallTileset2 = map.addTilesetImage("tilewine",'tilesWine');
        const furnitureTileset1 = map.addTilesetImage("tilefurniture",'tilesFurni');
        const furnitureTileset2 = map.addTilesetImage("tilefurnituredeco",'tilesFurniDeco');
        const decoTileset = map.addTilesetImage("tiledeco",'tilesDeco');
        const foodTileset = map.addTilesetImage("tilefood",'tilesFood');
        const chairTileset = map.addTilesetImage("tilechair", 'tilesChair');
        // const decoTileset = map.addTilesetImage("tilefurnituredeco",'tilesFurniDeco');
        
        // 레이어 생성
        // 2배 확대 : setScale(2) -> setZoom 으로 대체
        // const layer1 = map.createLayer('floorLayer', floorTileset, 0, 0).setScale(2);
        const layer1 = map.createLayer('floorLayer', floorTileset, 0, 0)
        const layer2 = map.createLayer('wallLayer', [wallTileset1, wallTileset2], 0, 0)
        const layer3 = map.createLayer('decoLayer', [furnitureTileset1,furnitureTileset2,decoTileset], 0, 0)
        const layer4 = map.createLayer('tableLayer', [furnitureTileset1,furnitureTileset2], 0, 0)
        // const layer5 = map.createLayer('chairLayer', [furnitureTileset1,furnitureTileset2], 0, 0)
        const layer6 = map.createLayer('foodLayer', [furnitureTileset1, foodTileset], 0, 0)
        // const layer3 = map.createLayer('Tile Layer 3', tileset3, 0, 0);


        //// 타일에 충돌(Collision) 적용
        // Tiled에서 생성한 collides 적용
        layer2.setCollisionByProperty({ collides: true });
        layer3.setCollisionByProperty({ collides: true });
        layer4.setCollisionByProperty({ collides: true });
        
        // Tiled에서 찍은 타일 번호 값 적용
        // 벽
        // layer2.setCollisionBetween(803, 1797);
        // 책상
        // layer3.setCollisionBetween(4195, 4228);
        

        //// 플레이어
        // image로 캐릭터 선택
        // this.player = this.physics.add.sprite(100, 150, 'character')

        // JSON으로 불러온 캐릭터 적용
        // 캐릭터 선택
        this.characterKey = 'lucy'
        this.imageName = 'Lucy'
        // this.characterKey = 'ash'
        // this.imageName = 'Ash'

        // 캐릭터 & 시작 위치 설정
        this.player = this.physics.add.sprite(100, 150, this.characterKey).setScale(0.8).setDepth(32)
        
        
        //// chairObject 레이어 생성
        const chairLayer = map.getObjectLayer('chairObject');
        const chairs = this.physics.add.staticGroup()
        let overlapChair = -1
        let seat = function(id){
            overlapChair = id
            // console.log(overlapChair)
            // return overlapChair;
        } 
        chairLayer.objects.forEach((chairObj, i) => {
            // const obj = chairs.create(object.x, object.y, )
            // console.log(chairObj.properties)
            const item = chairs.get(chairObj.x + 28 * 0.5, chairObj.y - 32 * 0.5, 'chairs', chairObj.gid - chairTileset.firstgid)
            const id = `${i}`
            item.id = id
            this.physics.add.overlap(this.player, item, seat(item.id), null, this);
            // this.physics.add.overlap(this.player, item, seat(item.id), null, this);
        })
        // console.log(overlapChair)


        //// 플레이어에 충돌 적용
        // 왜 안돼!!!!!!
        // 플레이어 월드 바깥 이동제한
        // this.player.setCollideWorldBounds(true);
        
        // 타일에 충돌 적용
        this.physics.add.collider(this.player, [layer2, layer3, layer4]);
        // this.physics.add.collider(this.player, layer3);
        // this.physics.add.collider(this.player, layer4);

        //// 키보드 입력기
        this.cursors = this.input.keyboard.createCursorKeys();
        // 키보드 입력키 추가
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
        // this.wasdKeys = this.input.keyboard.addKeys({
        //     up: Phaser.Input.Keyboard.KeyCodes.W,
        //     down: Phaser.Input.Keyboard.KeyCodes.S,
        //     left: Phaser.Input.Keyboard.KeyCodes.A,
        //     right: Phaser.Input.Keyboard.KeyCodes.D,
        //   });
        

        //// 카메라 설정 ( 순서 중요!!!!!!!! )
        // 1. 경계 밖으로 카메라가 나가지 않도록 설정
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // 2. 플레이어를 중앙으로 카메라 이동
        this.cameras.main.startFollow(this.player);
    
        // 카메라로 맵 2배 확대 (setScale(2) 대신 가능)
        this.cameras.main.setZoom(2);


        //// 애니메이션 적용
        // 사용할수있는 모든 프레임 이름 추출
        // const frameNames= this.textures.get(`${characterKey}`).getFrameNames();
        // console.log(frameNames)

        // 애니메이션 함수 적용 (애니메이션 움직임을 createAnims함수로 만듬)
        this.createAnims(this.characterKey, this.imageName)  
    }
    
    // 실시간 반영
    update() {

        // 디버그용 (1초 간격으로 플레이어 좌표를 콘솔에 출력)
        // console.log(this.player.body.x, this.player.body.y); 

        let speed = 160;
        // Shift 키를 누르면서 이동하면 빠르게 이동
        if (this.keyZ.isDown) {speed = 220;}
    

        //// 이전 속도 (애니메이션 적용에 순서 중요!!!!)
        // 1.이전 속도(x,y) 저장
        const prevVelocity = this.player.body.velocity.clone();
        // 2.이전 프레임의 속도를 0으로 설정
        this.player.setVelocity(0);         // (setVelocityY(0);, setVelocityX(0);)
        

        //// 플레이어 이동 & 애니메이션
        // 앉는 애니메이션 적용 방향
        this.sit = 0
        
        // 이동 & 애니메이션 적용 (좌우 이동 우선시)
        if (this.cursors.left.isDown) {
            // 플레이어 이동
            this.player.setVelocityX(-speed);
            // 애니메이션
            this.player.anims.play(`${this.characterKey}_run_left`, true);
            this.sit = 1
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play(`${this.characterKey}_run_right`, true);
            this.sit = 2
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play(`${this.characterKey}_run_up`, true);
            this.sit = 3
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play(`${this.characterKey}_run_down`, true);
            this.sit = 4
        } else {
            // this.player.anims.stop();
            // console.log(prevVelocity)

            // 이동하다 멈추면, 사용할 프레임 선택 & idle상태로 전환
            if (prevVelocity.x < 0) {this.player.anims.play(`${this.characterKey}_idle_left`, true)}
            else if (prevVelocity.x > 0) {this.player.anims.play(`${this.characterKey}_idle_right`, true)}
            else if (prevVelocity.y < 0) {this.player.anims.play(`${this.characterKey}_idle_up`, true)}
            else if (prevVelocity.y > 0) {this.player.anims.play(`${this.characterKey}_idle_down`, true)}
        }

        // 앉는 애니메이션 적용
        // 'E' 키 눌렀을 때 앉는 모션 추가
        if (this.keyX.isDown) {
            // console.log(prevVelocity)
            // console.log(this.sit)
            // this.player.anims.play(`${this.characterKey}_sit_left`, true);
            // console.log(this.overlapChair)

            // 나중에 의자 모양에 따라 모션이 바뀌는 걸로 조정 !!!!!!!!!!!!!!!!!!!!!!
            if (this.sit === 1) {this.player.anims.play(`${this.characterKey}_sit_left`, true)}
            else if (this.sit === 2) {this.player.anims.play(`${this.characterKey}_sit_right`, true)}
            else if (this.sit === 3) {this.player.anims.play(`${this.characterKey}_sit_up`, true)}
            else if (this.sit === 4) {this.player.anims.play(`${this.characterKey}_sit_down`, true)}
        }

    }

    //////////////////////// FUNCTIONS ////////////////////////


    // 애니메이션 움직임 함수 생성
    createAnims(characterKey,imageName) {
        this.anims.create({
            // key: 'ash_idle_right',
            key: `${characterKey}_idle_right`,
            frames: this.anims.generateFrameNames(characterKey, {
            prefix: `${imageName}_idle_anim_`,
            suffix: '.png',
              start: 1,
              end: 6,
            }),
            // 반복
            repeat: -1,
            // 프레임 속도
            frameRate: 7
            })
          
          this.anims.create({
            key: `${characterKey}_idle_up`,
            frames: this.anims.generateFrameNames(characterKey, {
                prefix: `${imageName}_idle_anim_`,
                suffix: '.png',
                start: 7,
                end: 12,
            }),
            repeat: -1,
            frameRate: 7
          })
          
          this.anims.create({
            key: `${characterKey}_idle_left`,
            frames: this.anims.generateFrameNames(characterKey, {
                prefix: `${imageName}_idle_anim_`,
                suffix: '.png',
                start: 13,
                end: 18,
            }),
            repeat: -1,
            frameRate: 7
          })
        
          this.anims.create({
            key: `${characterKey}_idle_down`,
            frames: this.anims.generateFrameNames(characterKey, {

                prefix: `${imageName}_idle_anim_`,
                suffix: '.png',
                start: 19,
                end: 24,
            }),
            repeat: -1,
            frameRate: 7
          })
   
        this.anims.create({
            key: `${characterKey}_run_right`,
            frames: this.anims.generateFrameNames(characterKey, {
                prefix: `${imageName}_run_`,
                suffix: '.png',
                start: 1,
                end: 6,
            }),
            // 반복
            repeat: -1,
            // 프레임 속도
            frameRate: 13,
        })
        
        this.anims.create({
            key: `${characterKey}_run_up`,
            frames: this.anims.generateFrameNames(characterKey, {
                prefix: `${imageName}_run_`,
                suffix: '.png',
                start: 7,
                end: 12,
            }),
            repeat: -1,
            frameRate: 13,
        })
        
        this.anims.create({
            key: `${characterKey}_run_left`,
            frames: this.anims.generateFrameNames(characterKey, {
                prefix: `${imageName}_run_`,
                suffix: '.png',
                start: 13,
                end: 18,
            }),
            repeat: -1,
            frameRate: 13,
        })
        
        this.anims.create({
            key: `${characterKey}_run_down`,
            frames: this.anims.generateFrameNames(characterKey, {
                prefix: `${imageName}_run_`,
                suffix: '.png',
                start: 19,
                end: 24,
            }),
            repeat: -1,
            frameRate: 13,
        })

        this.anims.create({
            key: `${characterKey}_sit_down`,
            frames: [{ key: characterKey, frame:`${imageName}_sit_down.png`}],
            // repeat: 0,
            frameRate: 20,
        })
        
        this.anims.create({
            key: `${characterKey}_sit_left`,
            frames: [{ key: characterKey, frame:`${imageName}_sit_left.png`}],
            // repeat: 0,
            frameRate: 20,
        })
    
        this.anims.create({
            key: `${characterKey}_sit_right`,
            frames: [{ key: characterKey, frame:`${imageName}_sit_right.png`}],
            // repeat: 0,
            frameRate: 20,
        })
    
        this.anims.create({
            key: `${characterKey}_sit_up`,
            frames: [{ key: characterKey, frame:`${imageName}_sit_up.png`}],
            // repeat: 0,
            frameRate: 20,
        })
    }   
}

export default PlayingScene;