#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <stdint.h>
#include <stdbool.h>
#include <ctype.h>

#define L 500
#define MCS_max 100000
#define MCS_min 10000

#define lanes 2
#define AMB 1 //AMB percent
//#define Vm 1

int main2(){
int s[L+1][lanes+1];
int v[L+1][lanes+1];
int i,j,n,sL,sLanes,nextL,sd,MCS,jump,jumpLanes,nextsL,sLcheck,loop;
int Vm,l;
double flux1,flux2,N1,N2,rho1,rho2,N;

long int step = (double)1*L/500; //10
long int AMBstep = (double)step*AMB; // 1

int Vs[L];
int Nc[L];

srand(2);

Vs[1]=1;
Vs[2]=2;
Vs[3]=3;
Vs[4]=7;
Vs[5]=15;
Vs[6]=2000;
Nc[1]=285;
Nc[2]=320;
Nc[3]=336;
Nc[4]=336;
Nc[5]=336;
Nc[6]=336;

for(l=1;l<=6;l++){
	Vm=Vs[l];
	n=Nc[l];
	int t=1; //time searching phase transition


char fname1[30]="AMB100_seq_rho_";
char buf1[100000];
sprintf(buf1, "%s%d_ds1.dat", fname1, Vm);
FILE *f1;
f1 = fopen(buf1,"w");



//for(n=350;n<=450;n=n+20){
//for (n=step;n<L/5;n=n+step){ //outer for... in order to generate data for each step
while(t<=600){ //searching or phase transition
//n=50;
 N = n;
 N1 = N-N*AMBstep/step;
 N2 = N*AMBstep/step;
 flux1=0;
 flux2=0;

//initial condition all zeros
for (i=0;i<=L+1;i++){
for (j=0;j<=lanes+1;j++){ // all zeros to clear the board
		s[i][j]=0; //clear lattice
		v[i][j]=0; //clear lattice
	  }}

//add cars in order
  for (i=1;i<=N1;i++){
  for (j=1;j<=lanes;j++){
    s[i][j]=1;
  }}

  //add AMB in order
  for (i=N1+1;i<=N1+N2;i++){
  for (j=1;j<=lanes;j++){
    s[i][j]=2;
  }}

  /*print data to screen*/
  // for (j=1;j<=lanes;j++){
  // for (i=1;i<=L;i++){
  // printf("%2d ",s[i][j]);
  // }
  // printf("\n");
  // }
  // printf("--------------------\n");
  /************************/



  for (MCS=1;MCS<=MCS_max;MCS++){// monte carlo dynamics start
  for (loop=1;loop<=N;loop++){// internal loop for MCS

	  /*sequential-random update - select vehicle*/
	   sL=rand()%((int)L)+1;
	   sLanes=rand()%(lanes)+1;
	   while(s[sL][sLanes]==0){//trick start.
		   sL=rand()%((int)L)+1;
		   sLanes=rand()%(lanes)+1;
	   }//trick end
	   /************************/

//printf("sL=%d sLanes=%d ",sL,sLanes);

	   /*determine next vehicle*/
	   if(s[sL][sLanes]!=0){ //start movement dynamics
		   nextL=sL+1;
		   if(nextL>L){nextL=nextL-L;}
		  while(s[nextL][sLanes]==0){
		  			   nextL=nextL+1;
		  			   if(nextL>L){nextL=nextL-L;}
		  		   }
	   /************************/

	  /*determine safe distance*/
	   if(nextL<=sL){sd = nextL-sL+L-1;}
	   else{sd=nextL-sL-1;}
	   /************************/

	   /*update speed with particle interaction*/
		nextsL=sL+sd+1;
		if(nextsL>L){nextsL=nextsL-L;}
if(sd<=1){// if sd<=0, its the case with no particle interaction!
	   v[sL][sLanes]=fmin(fmin(fmin(Vm,sd),v[sL][sLanes]+1),v[nextsL][sLanes]);//interaction
	 //v[sL][sLanes]=fmin(fmin(Vm,sd),v[nextsL][sLanes]);//maximum acceleration
	   }
	   else{
	   v[sL][sLanes]=fmin(fmin(Vm,sd),v[sL][sLanes]+1);
	 //v[sL][sLanes]=fmin(Vm,sd);//maximum acceleration
	   }
      ///////////////////////////////
	  // keep in mind that we can exclude the term 'v[select]+1' and
	  // consider only Vm against d... this is closer to mean field approximation.
	  /************************/

		/*update dynamics*/
			sLcheck=sL+1;
	   	   	if(sLcheck>L){sLcheck=sLcheck-L;}
	   if(v[sL][sLanes]!=0 && s[sL][sLanes]!=0){
		   jump=sL+v[sL][sLanes];
		   if(jump>L){
			   jump=jump-L;
			   if(s[sL][sLanes]==1){if(MCS>MCS_min){flux1=flux1+1;}}
			   if(s[sL][sLanes]==2){if(MCS>MCS_min){flux2=flux2+1;}}
		   }
		   s[jump][sLanes]=s[sL][sLanes];
		   v[jump][sLanes]=v[sL][sLanes];
		   s[sL][sLanes]=0;
		   v[sL][sLanes]=0;
	   }
	   /************************/

	   //if(s[sL][sLanes]==2 && v[sL][sLanes]==0 && s[sLcheck][sLanes]!=0){//start AMB specific dynamics
	   else if(s[sL][sLanes]==2 && v[sL][sLanes]==0                         ){//start AMB specific dynamics
			   jump=sL+1;
			   jumpLanes=sLanes+1;
			   if(jump>L){jump=jump-L;}
			   if(jumpLanes>lanes){jumpLanes=jumpLanes-lanes;}
		if(s[sL][jumpLanes]==0 && s[jump][jumpLanes]==0){
			   if(sL+1>L){
				   //if(s[sL][sLanes]==1){if(MCS>MCS_min){flux1=flux1+1;}}
				   if(s[sL][sLanes]==2){if(MCS>MCS_min){flux2=flux2+1;}}
			   }
			   s[jump][jumpLanes]=s[sL][sLanes];
			   v[jump][jumpLanes]=v[sL][sLanes]+1;
			   s[sL][sLanes]=0;
			   v[sL][sLanes]=0;
			}}//close AMB dynamics lane change
	   }//end movement dynamics
// printf("%2d %2d ",(int)flux1,(int)flux2);
// printf("\n");

	   /*print data to screen*/
	   // for (j=1;j<=lanes;j++){
	   // for (i=1;i<=L;i++){
	   // printf("%2d ",s[i][j]);
	   // }
	   // printf("\n");
	   // }
	   // printf("--------------------");
	   //printf("\n");
	   /************************/



  }//for inner loop
  }//Monte Carlo loop

  rho1=N1/L;
  rho2=N2/L;
  flux1=(N/N1)*flux1/(MCS_max-MCS_min);
  flux2=(N/N2)*flux2/(MCS_max-MCS_min);
 //    printf ("%f %f %f \n",rho1+rho2,flux1,flux2);
 // fprintf(f1,"%f %f %f \n",rho1+rho2,flux1,flux2);

  printf ("%d %f\n",t,rho1+rho2);
  fprintf(f1,"%d %f\n",t,rho1+rho2);

  if(flux2==0){n=n-1;}
  else{n=n+1;}
  t=t+1;

}//outer for
}//Vm for
  return (0);
}//close main


