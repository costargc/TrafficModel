/*
 * NaSch_seq.c
 *
 *  Created on: 20 Feb 2017
 *      Author: Rodrigo Costa
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <stdint.h>
#include <stdbool.h>
#include <ctype.h>
//#include <conio.h>

#define L 1000
#define MCS_max 1000000
#define MCS_min 100000
//#define Vm 1
int Vm,l,run;

int main(){
char s[L];
int v[L];
int p[L];
int d[L];
int Vs[L];


Vs[1]=1;
Vs[2]=2;
Vs[3]=3;
Vs[4]=7;
Vs[5]=15;
Vs[6]=2000;

for(l=1;l<=6;l++){
	Vm=Vs[l];

char fname1[20]="NaSch_seq_zoom_flux_";
char buf1[100000];
sprintf(buf1, "%s%d.dat", fname1, Vm);
FILE *f1;
f1 = fopen(buf1,"w");

//char fname2[20]="NaSch_seq_d_";
//char buf2[100000];
//sprintf(buf2, "%s%d.dat", fname2, Vm);
//FILE *f2;
//f2 = fopen(buf2,"w");

//random seed - its important to keep a seed
//in oder to have data replicability
 srand(2);

double flux, N,rho;
int i,n,loop,sd,select,MCS,next;
int step = 1*L/1000;


 for (n=step;n<L/5;n=n+step){ //outer for... in order to generate data for each step
	  N = n;
	  flux=0;

	/*initial positioning*/
	  for (i=1;i<=L;i++){ // all zeros to clear the board
		s[i]=0; //clear lattice
		v[i]=0; //clear velocity
		p[i]=0; //clear position
		d[i]=0; //clear safe distance
	  }
	  	d[0]=0; // safe distance can be zero!
	  for (i=1;i<=N;i++){ // initial config populating N cars.
		s[i]=1; //1=Occupied / 0=empty
		v[i]=0; //start velocity = 0
		p[i]=i; // start position = first sites from left to right.
		// please note that the we consider a few initial monte carlo steps in
		// order to randomise the state before collecting data.
	  }
	/************************/

/**********************
 *Monte Carlo dynamics
 **********************/
  for (MCS=1;MCS<=MCS_max;MCS++){ // monte carlo dynamics start

	  /*control program progress*/
	  //float perc = ((((N-(L-step))/(L-step))+1)*100-(((N-(L))/(L-step))+1)*100)*(MCS-MCS_max)/(MCS_max-1)+(((N-(L-step))/(L-step))+1)*100;
	  //printf ("%f  %%\n", perc);//print program status
	  // this is just to make sure program is not hanging
	  // Pmax = (((N-(L))/(L-step))+1)*100;
  	  // Pmin = (((N-(L-step))/(L-step))+1)*100;
	  // equation used:
	  // P=(Pmax-Pmin)*(MCS-MCS_max)/(MCS_max-1)+Pmax
      /************************/

  for (loop=1;loop<=N;loop++){ // internal loop for MCS

	  /*print data to screen*/
	  // for(i=1;i<=L;i++){s[i]='.';}//formating/convert empty spaces to '.'
	  // for(i=1;i<=N;i++){s[p[i]]=v[i];}//add speed instead of 1=Occupied
	  // printf ("\n");//break line
	  // for(i=1;i<=L;i++){//print data begins
	  //   if (iscntrl(s[i])){printf ("%2i",s[i]);} //account for numbers
	  //   else{printf ("%2c",s[i]);}} //account for special letters such as '.'
	  //notice that we are showing data with a 2 spaced apart.
	   /************************/

	  /*sequential-random update - select vehicle*/
	  select=rand()%((int)N)+1; // select vehicle between available ones
	  /************************/

	  /*determine next vehicle*/
	  if(select+1>N){ // identify next vehicle.
		  next=select+1-N; //periodic condition
	  }
	  else{
		  next=select+1;
	  } // end next vehicle identification.
	  /************************/

	  /*determine next vehicle*/
	  if(p[next]<=p[select]){ // Begin safe distance analysis
		   sd= p[next]- p[select]+L-1;//periodic condition
		  	  }
	  	  else{
			  	  sd = p[next]-p[select]-1;
		  	  }//conclude safe distance analysis
	  if(MCS>MCS_min){d[sd]=d[sd]+1;} // Allocate to a vector the safe distances
	  	   // we aim to generate a histogram with this data
	  /************************/

	  /*update speed*/
	  v[select]=fmin(fmin(Vm,sd),v[select]+1); //select velocity to update
	  //v[select]=fmin(Vm,sd); //another option with maximum acceleration!!!
	  ///////////////////////////////
	  // keep in mind that we can exclude the term 'v[select]+1' and
	  // consider only Vm against d... this is closer to mean field approximation.
	  /************************/

	  /*update dynamics*/
	  if(s[p[select]]!=0){s[p[select]]=0;}// remove vehicle from current location
	  if(p[select]+v[select]>L){
		  p[select]=p[select]+v[select]-L;//periodic condition
		  	  /*count flux*/
		  	  if(MCS>MCS_min){flux=flux+1;} // count flux
		  	  //printf ("   [%f]",flux); // print flux
	  	  }
	  	  else{
	  		  p[select]=p[select]+v[select];
	  	  }
	  s[p[select]]=1; // add vehicle to new location
	  /************************/

  } // end internal monte carlo loop
} // monte carlo dynamics end

rho=N/L;
flux=(double)flux/(MCS_max-MCS_min);
printf ("%f %f\n",rho,flux);
fprintf(f1,"%f %f\n",rho,flux);

//if(n==5*step || n==L/4 || n==L/2 || n==L-5*step){
//for(sd=0;sd<=L/25;sd++){
//fprintf(f2,"%f %f %d %f\n",rho,flux,sd,(double)d[sd]/(MCS_max-MCS_min)/loop);
//}}

 }//outer for
}
  return (0);
}
