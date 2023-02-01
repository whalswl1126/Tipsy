package com.ssafy.domainnosql.dao.room;

import java.util.List;
import java.util.Map;

import com.ssafy.domainnosql.vo.MemberVo;
import com.ssafy.domainnosql.vo.RoomVo;

public interface RoomDao {
	void createRoom(RoomVo roomvo);
	void changeSet(RoomVo roomvo);

	int enterRoom(MemberVo membervo);
	
	boolean exitRoom(String roomcode, String uid);
	void banUser(String roomcode, String uid);
	
	int[][] getBuilding();
	List<Map<Object, Object>> getTable(int bno);
	
	boolean isExists(String key);
}
