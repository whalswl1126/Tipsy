package com.hanjan.hanjangame

import android.animation.ObjectAnimator
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.Settings.Global
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import com.fasterxml.jackson.module.kotlin.jacksonMapperBuilder
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.hanjan.hanjangame.adapter.GameResultRecyclerViewAdapter
import com.hanjan.hanjangame.adapter.showGameResultRecyclerViewDialog
import com.hanjan.hanjangame.databinding.ActivityOrderingBinding
import com.hanjan.hanjangame.databinding.GameResultListDialogBinding
import com.hanjan.hanjangame.dto.GameResult
import com.hanjan.hanjangame.dto.User
import kotlinx.coroutines.*
import org.json.JSONObject
import java.text.DecimalFormat
import java.util.*

class OrderingActivity : AppCompatActivity() {
    private lateinit var binding: ActivityOrderingBinding
    private lateinit var timer: Job
    private var time = 1500
    private val list = mutableListOf<Int>()
    private val btnList = mutableListOf<Button>()
    private var count = 1
    private var wait: Job? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOrderingBinding.inflate(layoutInflater)
        setContentView(binding.root)
        initList()
        initButtonList()
        randomList()
        changeButtonText()
        buttonSetOnClick()
        GlobalApplication.stompClient?.topic("/sub/play/ordering-game/${GlobalApplication.roomNumber}")?.subscribe {
            val result = jacksonObjectMapper().readValue<List<GameResult>>(it.payload)
            wait?.cancel()
            runOnUiThread {
                binding.timerBackground.visibility = View.GONE
                binding.waiting.visibility = View.GONE
//                val binding = GameResultListDialogBinding.inflate(layoutInflater)
//                setContentView(binding.root)
//                binding.recyclerView.adapter = GameResultRecyclerViewAdapter(result)
//                binding.recyclerView.layoutManager = LinearLayoutManager(this)
//                CoroutineScope(Dispatchers.IO).launch {
//                    delay(3000)
//                    finish()
//                }
                showGameResultRecyclerViewDialog(this, result)
            }
        }
        timer = CoroutineScope(Dispatchers.IO).launch {
            runOnUiThread {
                binding.orderingTitle.visibility = View.VISIBLE
                ObjectAnimator.ofFloat(binding.orderingTitle, "alpha", 1f, 0f).apply {
                    duration = 1000
                    start()
                }
            }
            delay(1000L)
            runOnUiThread {
                binding.orderingTitle.visibility = View.GONE
                binding.timer3.visibility = View.VISIBLE
                ObjectAnimator.ofFloat(binding.timer3, "alpha", 1f, 0f).apply {
                    duration = 1000
                    start()
                }
            }
            delay(1000L)
            runOnUiThread {
                binding.timer3.visibility = View.GONE
                binding.timer2.visibility = View.VISIBLE
                ObjectAnimator.ofFloat(binding.timer2, "alpha", 1f, 0f).apply {
                    duration = 1000
                    start()
                }
            }
            delay(1000L)
            runOnUiThread {
                binding.timer2.visibility = View.GONE
                binding.timer1.visibility = View.VISIBLE
                ObjectAnimator.ofFloat(binding.timer1, "alpha", 1f, 0f).apply {
                    duration = 1000
                    start()
                }
            }
            delay(1000L)
            runOnUiThread {
                binding.timer1.visibility = View.GONE
                binding.timerBackground.visibility = View.GONE
            }
            while (time>0){
                time--
                runOnUiThread {
                    binding.timer.setText("${(time/100)}.${DecimalFormat("00").format((time % 100))}초")
                }
                delay(10L)
            }
            runOnUiThread {
                sendResult()
                //서버에 데이터 보내고 다른 데이터 받을 때 까지 대기 필요
            }
        }
    }

    fun initList(){
        for(i in 1..15){
            list.add(i)
        }
    }

    fun initButtonList(){
        btnList.add(binding.btn1)
        btnList.add(binding.btn2)
        btnList.add(binding.btn3)
        btnList.add(binding.btn4)
        btnList.add(binding.btn5)
        btnList.add(binding.btn6)
        btnList.add(binding.btn7)
        btnList.add(binding.btn8)
        btnList.add(binding.btn9)
        btnList.add(binding.btn10)
        btnList.add(binding.btn11)
        btnList.add(binding.btn12)
        btnList.add(binding.btn13)
        btnList.add(binding.btn14)
        btnList.add(binding.btn15)
    }

    fun randomList(){
        for(i in 0..100){
            var random = Random().nextInt(list.size)
            var temp = list[random]
            list.remove(temp)
            list.add(temp)
        }
    }

    fun changeButtonText(){
        for(i in 0..14){
            btnList[i].text = "${list[i]}"
        }
    }

    fun buttonSetOnClick(){
        for(i in 0..14){
            btnList[i].setOnClickListener {
                if(count == btnList[i].text.toString().toInt()){
                    if(count == 15){
                        timer.cancel()
                        sendResult()
                        binding.timerBackground.visibility = View.VISIBLE
                        binding.waiting.visibility = View.VISIBLE
                        wait = CoroutineScope(Dispatchers.IO).launch {
                            while (true){
                                runOnUiThread {
                                    ObjectAnimator.ofFloat(binding.waiting, "alpha", 1f, 0f).apply {
                                        duration = 500
                                        start()
                                    }
                                }
                                delay(500)
                                runOnUiThread {
                                    ObjectAnimator.ofFloat(binding.waiting, "alpha", 0f, 1f).apply {
                                        duration = 500
                                        start()
                                    }
                                }
                                delay(500)
                            }
                        }
                        //서버에 데이터 보내고 다른 데이터 받을 때 까지 대기 필요
                    }
                    count++
                    ObjectAnimator.ofFloat(btnList[i], "scaleX", 1.0f, 0f).apply {
                        duration = 500
                        start()
                    }
                    ObjectAnimator.ofFloat(btnList[i], "scaleY", 1.0f, 0f).apply {
                        duration = 500
                        start()
                    }
                }
            }
        }
    }

    fun sendResult(){
        val data = JSONObject()
        data.put("nickname", GlobalApplication.user.nickname)
        data.put("image", GlobalApplication.user.img)
        data.put("score", time)
        GlobalApplication.stompClient?.send("/game/play/ordering-game/${GlobalApplication.roomNumber}", data.toString())?.subscribe()
    }

    override fun onBackPressed() {

    }
}