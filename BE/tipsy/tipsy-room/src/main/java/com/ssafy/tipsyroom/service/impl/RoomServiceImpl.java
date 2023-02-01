package com.ssafy.tipsyroom.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.domainnosql.dao.room.RoomDao;
import com.ssafy.domainnosql.vo.MemberVo;
import com.ssafy.domainnosql.vo.RoomVo;
import com.ssafy.tipsyroom.service.RoomService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

	private final Logger logger = LoggerFactory.getLogger(RoomServiceImpl.class);
	
	@Autowired
	private final RoomDao roomDao;

	@Override
	public String createRoom(RoomVo roomvo) {

		System.out.println("테이블 위치 : " + roomvo.getCode());
		
		// 현재 room DB에 없는 랜덤 코드가 나올 때까지
		String roomcode = "";
		while(true) {
			roomcode = getRandomCode() + roomvo.getCode();
			if(!roomDao.isExists("room:"+roomcode)) {
				break;
			}
		}
		System.out.println("roomcode = " + roomcode);
		roomvo.setCode(roomcode);
		
		// 생성
		roomDao.createRoom(roomvo);
		
		
		logger.info(roomvo.getCode() + "방이 생성되었습니다.");
		logger.info("  Title : " + roomvo.getTitle());
		logger.info("  최대 인원 : " + roomvo.getMax());
		if(roomvo.getPassword() != null) {
			logger.info("  공개범위 : 비공개(" + roomvo.getPassword() + ")");
		} else {
			logger.info("  공개범위 : 공개방");
		}
		logger.info("  입장 시 효과 : " + (roomvo.getEntrance()>0?"on":"off"));
		logger.info("  침묵 시 효과 : " + (roomvo.getSilence()>0?"on":"off"));
		logger.info("  방 생성 시간 : " + String.format("yyyy년 MM월 dd일 HH시 mm분 ss초", roomvo.getTime()));
		String tags = "";
		for (String tag : roomvo.getHashtag()) {
			tags += " #" + tag;
		}
		logger.info("  해시태그 :" + tags);
		
		return roomvo.getCode();
	}
	
	@Override
	public void changeSet(RoomVo roomvo) {
		roomDao.changeSet(roomvo);	
	}
	
	@Override
	public int enterRoom(MemberVo membervo) {
		return roomDao.enterRoom(membervo);
	}
	
	
	//5자리 랜덤 코드 생성
	private String getRandomCode() {
		int leftLimit = 48; // numeral '0'
		int rightLimit = 122; // letter 'z'
		int targetStringLength = 5;
		Random random = new Random();

		String generatedString = random.ints(leftLimit, rightLimit + 1)
				.filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(targetStringLength)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();

		return generatedString;
	}


	@Override
	public void exitRoom(String roomcode, String uid) {

		if(roomDao.exitRoom(roomcode, uid)) {
			logger.info("남아있는 사람이 없어 " + roomcode + "방을 삭제하였습니다.");
		}
	}

	@Override
	public void banUser(String roomcode, String uid) {
		roomDao.banUser(roomcode, uid);
		roomDao.exitRoom(roomcode, uid);
	}
	
	@Override
	public List<Map<Object, Object>> getTable(int bno) {
		return roomDao.getTable(bno);
	}
	
	@Override
	public int[][] getBuilding() {
		return roomDao.getBuilding();
//		for (int i = 0; i < 6; i++) {
//			logger.info(i + "번 건물에 생성되어 있는 테이블 정보들");
//			for (Map<Object, Object> map : list[i]) {
//				logger.info(String.valueOf(map));
//			}
//		}
	}
	
	
	
	
	@Override
	public void test() {
		
//		try {
//
//			ZSetOperations<String, String> stringZSetOperations = stringRedisTemplate.opsForZSet();
//			
//			String Date = String.valueOf(stringZSetOperations.score("room:"+roomcode+":member", uid));
//			Date date = new SimpleDateFormat("yyyyMMDDHHmmss").parse(Date);
//	        long time = date.getTime();
//
//	        Timestamp ts = new Timestamp(time);
//
//	        System.out.println(ts);
//			
//	        stringZSetOperations.range
//	        
//	        
//		} catch (ParseException e) {
//			e.printStackTrace();
//		}
		
	}


}
