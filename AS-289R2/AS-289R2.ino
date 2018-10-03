/* Sample program
   AS-289R2 Thermal Printer Shield
   NADA ELECTRONICS, LTD.
   Copyright (c) 2017 Takehiro Yamaguchi, MIT License

   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
   and associated documentation files (the "Software"), to deal in the Software without restriction,
   including without limitation the rights to use, copy, modify, merge, publish, distribute,
   sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or
   substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
   BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
#include <avr/pgmspace.h>
#include <AS289R2.h>
#include "image.h"  // MonochromeBitmap to cpp : http://www.nada.co.jp/as289r2/en/ex_bitmap.html

#define SIZE_OF_ARRAY(ary)  (sizeof(ary)/sizeof((ary)[0]))
String argv[20] = "", input = "";
#define LED_PIN 13

// Constructor
// Hardwear Serial
// Arduino UNO : Serial
// Arduino/Genuino 101 : Serial1
AS289R2 tp(Serial);

int split(String data, char delimiter, String *dst, size_t arraySize) {
  int index = 0;
  //  int arraySize = resultSize;
  //  Serial.println(arraySize);
  int datalength = data.length();
  //  Serial.println(datalength);
  for (int i = 0; i < datalength; i++) {
    char tmp = data.charAt(i);
    if ( tmp == delimiter ) {
      index++;
      if ( index > (arraySize - 1)) return -1;
    }
    else dst[index] += tmp;
  }
  return (index + 1);
}

void AS289R2_demo()
{
  /* initialize */
  tp.initialize();
  tp.putLineFeed(2);


  //  tp.println("2018年 9月 13日 (木) 16:00");
  tp.println(argv[0]);
  tp.println("ID:" + argv[1]);

  tp.putLineFeed(2);
  tp.println("今日の成果");
  tp.println("距離: " + argv[2] + "km");
  tp.println("消費カロリー: " + argv[3] + "kcal");
  tp.println("-----------------------------");
  tp.println("今週の成果");
  tp.println("距離: " + argv[4] + "km");
  tp.println("消費カロリー: " + argv[5] + "kcal");
  tp.println("-----------------------------");
  tp.println("これまでの成果");
  tp.println("運動時間: " + argv[6]);
  tp.println("距離: " + argv[7] + "km");
  tp.println("消費カロリー: " + argv[8] + "kcal");

  tp.putLineFeed(2);
  
  tp.println("/***************************/");
  tp.println(argv[9]);
  tp.putLineFeed(1);
  tp.println("/***************************/");

  //  tp.println(input);
  //  for (int k = 0; k < 12; k++) {
  //    tp.println(argv[k]);
  //  }
  tp.putLineFeed(12);
  //  tp.putPaperFeed(120);
  /* Image : HEADER */
  int lines = sample_image_len / 48;
  tp.printBitmapImage(0x63, lines);
  byte myImage;
  for (uint16_t i = 0; i < (48 * lines); i++) {
    myImage = pgm_read_byte_near(&sample_image[i]);
    tp.write(myImage);
  }

  //  tp.putLineFeed(2);
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);

  Serial.begin(38400);
}

void loop() {
  if (Serial.available() > 0) {
    //    Serial.println("received");
    input = Serial.readStringUntil(";");
    input.replace(";", "\0");
    int index = split(input, ',', argv, SIZE_OF_ARRAY(argv));
    //    for (int k = 0; k < 12; k++) {
    //      Serial.println(argv[k]);
    //    }
    delay(10);

    AS289R2_demo();
    delay(25);
    memset(argv, '\0', sizeof(argv));
  }
}
